import { Response } from "express";

export const sendResponse = (res: Response, statusCode: number, status: string, responseMsg?: string, additionalProps: any = {}) => {
  res.status(statusCode).json({
    status: status,
    message: responseMsg,
    data: { ...additionalProps }
  });
};