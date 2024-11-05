require("dotenv").config();

const config = {
    secretKey: process.env.SECRET_KEY,
    secretIv: process.env.SECRET_IV,
    encryptionMethod: process.env.ENCRYPTION_METHOD,
  };
  
  if (!config.secretKey || !config.secretIv || !config.encryptionMethod) {
    throw new Error('SECRET_KEY, SECRET_IV, and ENCRYPTION_METHOD are required in .env file');
  }

export default config;