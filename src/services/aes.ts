import crypto from "crypto";
import config from "../config/cryptoConfig";

const { secretKey, secretIv, encryptionMethod } = config;

const generateKey = (extraKey = '') => {
  const fullKey = secretKey + extraKey;
  return crypto
  .createHash("sha512")
  .update(fullKey)
  .digest("hex")
  .substring(0, 32);
}

const encryptionIv = crypto
  .createHash("sha512")
  .update(secretIv)
  .digest("hex")
  .substring(0, 16);

// Encrypt data
export const encrypt = (text, extraKey = '') => {
  try {
    const key = generateKey(extraKey);
    const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return Buffer.from(encrypted, "hex").toString("base64");
  } catch (error) {
    console.error("Encryption failed:", error.message);
    throw new Error("Encryption error: Unable to encrypt the provided text.");
  }
};

// Decrypt data
export const decrypt = (encryptedText, extraKey = '') => {
  try {
    const key = generateKey(extraKey);
    const encryptedBuffer = Buffer.from(encryptedText, "base64").toString("hex");
    const decipher = crypto.createDecipheriv(encryptionMethod, key, encryptionIv);
    let decrypted = decipher.update(encryptedBuffer, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    throw new Error("Decryption error: Unable to decrypt the provided text.");
  }
};


export function generateTransId(identifier) {
  const timestamp = Date.now();
  const randomPart = crypto.randomBytes(3).toString('hex'); // 6 hex digits, providing 3 bytes of randomness

  return `${identifier}-${randomPart}-${timestamp}`;
}