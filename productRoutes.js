const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.json(results);
  });
});

router.get("/product/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  });
});

router.post("/product/add", (req, res) => {
  const { name, description, image, price, discount, stock } = req.body;
  const values = [name, description, image, price, discount, stock];

  db.query(
    "INSERT INTO products (name, description, image, price, discount, stock) VALUES (?, ?, ?, ?, ?, ?)",
    values,
    (err, results) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      const productId = results.insertId;
      db.query(
        "SELECT * FROM products WHERE id = ?",
        [productId],
        (err, newProduct) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          res.status(201).json(newProduct[0]);
        }
      );
    }
  );
});

router.patch("/product/modify/:id", (req, res) => {
  const id = req.params.id;
  const updatedFields = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: "No fields provided for update." });
  }

  const values = Object.values(updatedFields);
  values.push(id);

  const setClause = Object.keys(updatedFields)
    .map((field) => `${field} = ?`)
    .join(", ");

  const query = `UPDATE products SET ${setClause} WHERE id = ?`;

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (results.affectedRows > 0) {
      db.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, updatedProduct) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res.json(updatedProduct[0]);
        }
      );
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  });
});

router.patch("/product/stock/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT stock FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const currentStock = results[0].stock;

    if (currentStock > 0) {
      const newStock = currentStock - 1;

      db.query(
        "UPDATE products SET stock = ? WHERE id = ?",
        [newStock, id],
        (err, updateResult) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }

          res.json({ message: "Stock decremented successfully", newStock });
        }
      );
    } else {
      res.status(400).json({ message: "Product out of stock" });
    }
  });
});

router.delete("/product/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    if (results.affectedRows > 0) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  });
});

module.exports = router;
