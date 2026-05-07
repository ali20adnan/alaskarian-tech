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
    deleteProduct(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
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
