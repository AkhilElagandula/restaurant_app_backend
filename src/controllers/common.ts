import { Request, Response, NextFunction } from "express";
import { encrypt, decrypt } from "../services/aes";

export const encryptAndDecrypt = async (req: Request, res: Response) => {
    try {
        const { mode, text, msg } = req.body;
        let result = "";

        if (mode === "encrypt") {
            // Encrypt text with or without msg
            const encryptedMsg = msg ? await encrypt(msg) : undefined;
            result = await encrypt(text, encryptedMsg);

            return res.status(200).json({
                status: "Encrypted!!!",
                EncryptedString: result,
            });
        } else if (mode === "decrypt") {
            // Decrypt text with or without msg
            const decryptedMsg = msg ? await decrypt(msg) : undefined;
            result = await decrypt(text, decryptedMsg);

            return res.status(200).json({
                status: "Decrypted!!!",
                DecryptedString: result,
            });
        } else {
            return res.status(400).json({
                status: "Error!!!",
                message: "Invalid mode. Use 'encrypt' or 'decrypt'.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error!!!",
            ErrorTrace: error.message || error,
        });
    }
};