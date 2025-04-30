const express = require("express");
const router = express.Router();
const { streamOpenRouter } = require("../../controller/codeController.js");

router.post("/stream", streamOpenRouter);

module.exports = router;
