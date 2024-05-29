/// <reference types="cookie-parser" />
import { UsersService } from "./users.service";
import { Response, Request } from "express";
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    getDetailUser(res: Response, req: Request): Promise<void>;
    getAllUser(res: Response): Promise<void>;
    createUserHandler(res: Response, req: Request): Promise<void>;
    loginUserHandler(res: Response, req: Request): Promise<void>;
    updateUserHandler(res: Response, req: Request): Promise<void>;
}
