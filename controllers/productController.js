const productModel = require("../models/productModel");

class ProductController {
  getAllProducts(req, res) {
    productModel.getAllProducts((err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(results);
    });
  }

  searchProducts(req, res) {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is missing." });
    }

    productModel.searchProducts(searchTerm, (err, results) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ message: err.message });
      }

      if (results.length === 0) {
        return res.json({ message: "No matching products found." });
      }

      res.json({ message: "Products found", results });
    });
  }

  getProductById(req, res) {
    const id = req.params.id;
    productModel.getProductById(id, (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    });
  }

  searchProducts(req, res) {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is missing." });
    }

    productModel.searchProducts(searchTerm, (err, results) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ message: err.message });
      }

      if (results.length === 0) {
        return res.json({ message: "No matching products found." });
      }

      res.json({ message: "Products found", results });
    });
  }

  addProduct(req, res) {
    const productData = req.body;
    productModel.addProduct(productData, (err, results) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const productId = results.insertId;
      productModel.getProductById(productId, (err, newProduct) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json(newProduct[0]);
      });
    });
  }

  modifyProduct(req, res) {
    const id = req.params.id;
    const updatedFields = req.body;

    productModel.modifyProduct(id, updatedFields, (err, results) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (results.affectedRows > 0) {
        productModel.getProductById(id, (err, updatedProduct) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res.json(updatedProduct[0]);
        });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    });
  }

  decrementStock(req, res) {
    const id = req.params.id;

    productModel.decrementStock(id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.json(result);
    });
  }

  deleteProduct(req, res) {
    const id = req.params.id;

    productModel.deleteProduct(id, (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (results.affectedRows > 0) {
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    });
  }
}

module.exports = new ProductController();
