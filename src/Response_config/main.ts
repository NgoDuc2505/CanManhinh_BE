import { Response } from "express";

const success = (res: Response, data: any) => {
  return res.status(200).json({ data, msg: "success", status: res.statusCode });
};

const failed = (res: Response, msg: string = "Bad request !") => {
  return res.status(400).json({ data: [], msg });
};

const serverInterrupt = (res: Response) => {
  return res.status(500).json({ data: [], msg: "SERVER ERROR 500" });
};

//fulfilled 200
const successFl = (res: Response, content: any, msg = "success") => {
  return res.status(200).json({
    statusCode: 200,
    content,
    msg,
    date: new Date(),
  });
};
//rejected 400,404
const failureFl = (res: Response, statusCode: number, msg: string) => {
  return res.status(statusCode).json({
    statusCode,
    content: [],
    msg,
    date: new Date(),
  });
};
//server error 500
const serverErrorFl = (res: Response) => {
  return res.status(500).json({
    statusCode: 500,
    content: [],
    msg: "BE ERROR",
    date: new Date(),
  });
};

export {
  success,
  failed,
  serverInterrupt,
  serverErrorFl,
  failureFl,
  successFl,
};
