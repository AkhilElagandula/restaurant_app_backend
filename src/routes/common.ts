import express from "express";
import * as aes from "../controllers/common";

const router = express.Router();

router.post("/aes", aes.encryptAndDecrypt);

export default router;