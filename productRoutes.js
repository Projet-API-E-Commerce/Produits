const express = require("express");
const router = express.Router();
const productController = require("./controllers/productController");

router.get("/products", productController.getAllProducts);
router.get("/product/search", productController.searchProducts);
router.get("/product/:id", productController.getProductById);
router.post("/product/add", productController.addProduct);
router.patch("/product/modify/:id", productController.modifyProduct);
router.patch("/product/stock/:id", productController.decrementStock);
router.delete("/product/delete/:id", productController.deleteProduct);

module.exports = router;
