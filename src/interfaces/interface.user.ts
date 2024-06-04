import { Request, Response } from "express";

interface UserInterface {
  getUser(res: Response, req: Request);
  updateUserRole(res: Response, req: Request);
  createUser(res: Response, req: Request);
  loginUser(res: Response, req: Request);
  updateUser(res: Response, req: Request);
  getAllUser();
}

export default UserInterface;
