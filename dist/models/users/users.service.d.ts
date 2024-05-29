/// <reference types="cookie-parser" />
import { IUserSecure } from "src/interfaces/interfaces";
import { Request, Response } from "express";
export declare class UsersService {
    private salt;
    private exclude;
    private hashPass;
    private checkPass;
    private isUserExited;
    private findDetailUserByUserName;
    getUser(res: Response, req: Request): Promise<void>;
    getAllUser(): Promise<IUserSecure[] | null>;
    createUser(res: Response, req: Request): Promise<void>;
    loginUser(res: Response, req: Request): Promise<void>;
    updateUser(res: Response, req: Request): Promise<void>;
}
