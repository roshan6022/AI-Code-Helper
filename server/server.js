import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import codeHelperRoutes from "./src/routes/codeHelperRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/code", codeHelperRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
