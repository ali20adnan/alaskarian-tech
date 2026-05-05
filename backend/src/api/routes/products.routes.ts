import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../../../../database/index";
import type { Product } from "../../../../database/index";

export const productsRouter = Router();

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
