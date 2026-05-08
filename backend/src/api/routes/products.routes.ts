import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../../../../database/index";
import type { Product } from "../../../../database/index";
import { getDataDirectory } from "../../../../database/index";

export const productsRouter = Router();

const uploadsDir = path.join(getDataDirectory(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".bin";
      cb(null, `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`);
    },
  }),
});

productsRouter.get("/", (_req, res) => {
  try {
    res.json(listProducts());
  } catch {
    res.status(500).json({ error: "Failed to read products" });
  }
});

productsRouter.post("/", (req, res) => {
  try {
    const body = req.body as Omit<Product, "id">;
    const created = createProduct(body);
    res.json(created);
  } catch {
    res.status(500).json({ error: "Failed to create product" });
  }
});

productsRouter.put("/:id", (req, res) => {
  try {
    updateProduct(req.params.id, req.body as Partial<Product>);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update product" });
  }
});

productsRouter.delete("/:id", (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`Received request to delete product ID: ${productId}`);

    const products = listProducts();
    const productToDelete = products.find(p => p.id.toString() === productId.toString());

    if (productToDelete) {
      // 1. Delete associated files
      const filesToDelete = [
        ...(productToDelete.imageUrls || []),
        productToDelete.imageUrl,
        productToDelete.videoUrl
      ].filter(Boolean) as string[];

      filesToDelete.forEach(fileUrl => {
        const fileName = fileUrl.split("/").pop();
        if (fileName) {
          const filePath = path.join(uploadsDir, fileName);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted associated file: ${filePath}`);
            } catch (err) {
              console.error(`Failed to delete file: ${filePath}`, err);
            }
          }
        }
      });

      // 2. Delete from JSON
      deleteProduct(productId);
      
      console.log(`Successfully deleted product section for ID: ${productId}`);
      res.json({ success: true });
    } else {
      console.warn(`Product with ID ${productId} not found in database.`);
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error: any) {
    console.error("Delete Product API Error:", error.message);
    res.status(500).json({ error: "Internal server error during deletion" });
  }
});



productsRouter.post("/upload", upload.single("file"), (req: import("express").Request & { file?: import("multer").File }, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.json({
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      fileName: req.file.filename,
    });
  } catch {
    res.status(500).json({ error: "Failed to upload file" });
  }
});
