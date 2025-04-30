const express = require("express");
const app = express();
const codeHelperRoutes = require("./src/routes/codeHelperRoutes.js");
require("dotenv").config();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use("/api/code", codeHelperRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
