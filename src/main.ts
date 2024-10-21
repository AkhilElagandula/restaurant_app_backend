import dotenv from "dotenv";
import mongoose from 'mongoose';
import app from './server';
import http from 'http';
dotenv.config()

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
console.log(`The DB is ${DB}`);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  const protocol = httpServer instanceof http.Server ? 'http' : 'ws';
  // const socketURL = `${protocol}://${host}:${port}`;
  console.log(`App running at http://${host}:${port}/`);
  // console.log(`Socket.io server running at ${socketURL}/socket.io/`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err?.name, err?.message);
  httpServer.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  httpServer.close(() => {
    console.log('💥 Process terminated!');
  });
});
