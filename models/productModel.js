const db = require("../db");

class ProductModel {
  getAllProducts(callback) {
    db.query("SELECT * FROM products", callback);
  }

  searchProducts(searchTerm, callback) {
    const query =
      "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern], callback);
  }

  getProductById(id, callback) {
    db.query("SELECT * FROM products WHERE id = ?", [id], callback);
  }

  addProduct(productData, callback) {
    const { name, description, image, price, discount, stock } = productData;
    const values = [name, description, image, price, discount, stock];

    db.query(
      "INSERT INTO products (name, description, image, price, discount, stock) VALUES (?, ?, ?, ?, ?, ?)",
      values,
      callback
    );
  }

  modifyProduct(id, updatedFields, callback) {
    if (Object.keys(updatedFields).length === 0) {
      return callback({ message: "No fields provided for update." });
    }

    const values = Object.values(updatedFields);
    values.push(id);

    const setClause = Object.keys(updatedFields)
      .map((field) => `${field} = ?`)
      .join(", ");

    const query = `UPDATE products SET ${setClause} WHERE id = ?`;

    db.query(query, values, callback);
  }

  decrementStock(id, callback) {
    db.query(
      "SELECT stock FROM products WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          return callback({ message: err.message });
        }

        if (results.length === 0) {
          return callback({ message: "Product not found" });
        }

        const currentStock = results[0].stock;

        if (currentStock > 0) {
          const newStock = currentStock - 1;

          db.query(
            "UPDATE products SET stock = ? WHERE id = ?",
            [newStock, id],
            (err, updateResult) => {
              if (err) {
                return callback({ message: err.message });
              }

              callback(null, {
                message: "Stock decremented successfully",
                newStock,
              });
            }
          );
        } else {
          callback({ message: "Product out of stock" });
        }
      }
    );
  }

  deleteProduct(id, callback) {
    db.query("DELETE FROM products WHERE id = ?", [id], callback);
  }
}

module.exports = new ProductModel();
