const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const routes = require("./routes");
app.use("/", routes);

app.use((req, res) => {
  res.status(404).send("Page non trouvée");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erreur interne du serveur");
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
