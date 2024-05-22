import { Response } from "express";

const success = (res: Response, data: any) => {
  return res.status(200).json({data, msg: "success", status: res.statusCode});
};

const failed = (res: Response, msg: string = "Bad request !") => {
  return res.status(400).json({ data: [], msg });
};

const serverInterrupt = (res: Response) => {
  return res.status(500).json({ data: [], msg:"SERVER ERROR 500" });
};

export { success, failed, serverInterrupt };
