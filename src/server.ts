import express from 'express';
import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appError';
import userRouter from "./routes/user";
import commonRouter from "./routes/common";

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});
app.use("/api/users", userRouter);
app.use("/api/common", commonRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;