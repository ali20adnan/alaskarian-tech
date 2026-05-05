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
  const products = listProducts().filter((p) => p.id !== id);
  writeJsonFile(productsPath(), products);
}
