import { Request, Response } from "express";

interface RoleInterface {
  addGroup(res: Response, req: Request);
  addGroupRole(res: Response, req: Request)
}

export default RoleInterface;
