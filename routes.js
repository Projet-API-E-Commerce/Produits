const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Bienvenue sur mon API !");
});

router.post("/test", (req, res) => {
  const data = req.body;
  res.json({ message: "Données reçues avec succès !", data });
});

module.exports = router;
