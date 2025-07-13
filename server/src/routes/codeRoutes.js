import express from "express";
import { streamOpenRouter } from "../../controller/codeController.js";

const router = express.Router();

router.post("/stream", streamOpenRouter);

export default router;
