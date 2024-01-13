const productModel = require("../models/productModel");
const { verifyToken, checkOrder } = require("../middlewares/authMiddleware");
const { Upload } = require("@aws-sdk/lib-storage");
const { S3 } = require("@aws-sdk/client-s3");
const { ManagedUpload } = require("aws-sdk/lib/s3/managed_upload");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".png", ".webp", ".jpg"];
    const fileExtension = file.originalname.slice(
      file.originalname.lastIndexOf(".")
    );

    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format or exceeds size limit."), false);
    }
  },
});

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  region: process.env.AWS_REGION,
});

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

  addProduct(req, res) {
    verifyToken(req, res, async () => {
      try {
        const productData = req.body;
        const imageFile = req.file;

        const uploadParams = {
          Bucket: process.env.S3_BUCKET,
          Key: `images/${imageFile.originalname}`,
          Body: imageFile.buffer,
          ContentType: imageFile.mimetype,
        };

        const s3Data = await new Upload({
          client: s3,
          params: uploadParams,
        }).done();

        productData.imageUrl = s3Data.Location;

        const results = await productModel.addProduct(productData);

        const productId = results.insertId;
        const newProduct = await productModel.getProductById(productId);

        res.status(201).json(newProduct[0]);
      } catch (error) {
        res.status(500).json({
          message: `Échec du téléchargement de l'image sur S3: ${error.message}`,
        });
      }
    });
  }

  modifyProduct(req, res) {
    verifyToken(req, res, async () => {
      try {
        const id = req.params.id;
        const updatedFields = req.body;
        const imageFile = req.file;

        if (imageFile) {
          const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: `images/${imageFile.originalname}`,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype,
          };

          const s3Data = await new Upload({
            client: s3,
            params: uploadParams,
          }).done();

          updatedFields.imageUrl = s3Data.Location;

          const results = await productModel.modifyProduct(id, updatedFields);

          if (results.affectedRows > 0) {
            const updatedProduct = await productModel.getProductById(id);
            res.json(updatedProduct[0]);
          } else {
            res.status(404).json({ message: "Produit non trouvé" });
          }
        } else {
          const results = await productModel.modifyProduct(id, updatedFields);

          if (results.affectedRows > 0) {
            const updatedProduct = await productModel.getProductById(id);
            res.json(updatedProduct[0]);
          } else {
            res.status(404).json({ message: "Produit non trouvé" });
          }
        }
      } catch (error) {
        res.status(500).json({
          message: `Échec du téléchargement de la nouvelle image sur S3: ${error.message}`,
        });
      }
    });
  }

  decrementStock(req, res) {
    checkOrder(req, res, () => {
      const id = req.params.id;

      productModel.decrementStock(id, (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.json(result);
      });
    });
  }

  deleteProduct(req, res) {
    verifyToken(req, res, () => {
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
    });
  }
}

module.exports = new ProductController();
