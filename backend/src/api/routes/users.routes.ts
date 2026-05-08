import { Router } from "express";
import { query } from "../../lib/db";

export const usersRouter = Router();

// GET all admin users
usersRouter.get("/", async (req, res) => {
  try {
    const result = await query("SELECT id, name, email, role, avatar FROM admin_users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching admin users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST create a new admin user
usersRouter.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const result = await query(
      "INSERT INTO admin_users (name, email, role) VALUES ($1, $2, $3) RETURNING *",
      [name, email, role || 'editor']
    );
    
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating admin user:", error.message);
    if (error.code === '23505') { // unique_violation
      return res.status(400).json({ error: "User with this email already exists" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

// DELETE a user
usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM admin_users WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
