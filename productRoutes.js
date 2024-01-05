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

router.post("/products", (req, res) => {
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

router.put("/products/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, image, price, discount, stock } = req.body;
  const values = [name, description, image, price, discount, stock, id];

  db.query(
    "UPDATE products SET name = ?, description = ?, image = ?, price = ?, discount = ?, stock = ? WHERE id = ?",
    values,
    (err, results) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      if (results.affectedRows > 0) {
        db.query(
          "SELECT * FROM products WHERE id = ?",
          [id],
          (err, updatedProduct) => {
            if (err) {
              res.status(500).json({ message: err.message });
              return;
            }
            res.json(updatedProduct[0]);
          }
        );
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    }
  );
});

router.delete("/products/:id", (req, res) => {
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
