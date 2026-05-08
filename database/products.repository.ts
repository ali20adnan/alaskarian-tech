import fs from "node:fs";
import path from "node:path";

import { readJsonFile, writeJsonFile } from "./json-io";
import { ensureDataDirectory, getDataDirectory, getProjectRoot, getSeedsDirectory } from "./paths";
import type { Product } from "./types";

const FILE_NAME = "products.json";

function productsPath(): string {
  return path.join(getDataDirectory(), FILE_NAME);
}

function legacyRootProductsPath(): string {
  return path.join(getProjectRoot(), "products.json");
}

function seedPath(): string {
  return path.join(getSeedsDirectory(), "default-products.json");
}

export function ensureProductsFile(): void {
  ensureDataDirectory();
  const target = productsPath();
  if (fs.existsSync(target)) return;

  const legacy = legacyRootProductsPath();
  if (fs.existsSync(legacy)) {
    fs.copyFileSync(legacy, target);
    return;
  }

  const seed = readJsonFile<Product[]>(seedPath());
  writeJsonFile(target, seed);
}

export function listProducts(): Product[] {
  ensureProductsFile();
  return readJsonFile<Product[]>(productsPath());
}

export function createProduct(input: Omit<Product, "id">): Product {
  ensureProductsFile();
  const products = listProducts();
  const product: Product = { ...input, id: Date.now().toString() };
  products.push(product);
  writeJsonFile(productsPath(), products);
  return product;
}

export function updateProduct(id: string, patch: Partial<Product>): void {
  ensureProductsFile();
  const products = listProducts().map((p) =>
    p.id === id ? { ...p, ...patch, id: p.id } : p,
  );
  writeJsonFile(productsPath(), products);
}

export function deleteProduct(id: string): void {
  ensureProductsFile();
  const filePath = productsPath();
  const products = listProducts();
  
  console.log(`[DATABASE] Attempting to delete product with ID: "${id}"`);
  console.log(`[DATABASE] Target File Path: ${filePath}`);

  // فلترة المنتجات مع التأكد من تحويل كل شيء لنصوص لإزالة أي مسافات زائدة
  const filteredProducts = products.filter((p) => {
    const pId = String(p.id).trim();
    const targetId = String(id).trim();
    return pId !== targetId;
  });
  
  if (products.length === filteredProducts.length) {
    console.error(`[DATABASE] FAILED: Could not find product with ID "${id}" in the list.`);
  } else {
    writeJsonFile(filePath, filteredProducts);
    console.log(`[DATABASE] SUCCESS: Product "${id}" removed. New count: ${filteredProducts.length}`);
  }
}


