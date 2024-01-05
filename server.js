const express = require("express");
const dotenv = require("dotenv");
const productRoutes = require("./productRoutes");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
