import { UsersService } from "./users.service";
import { Response, Request } from "express";
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    getDetailUser(res: Response, id: string): Promise<void>;
    getAllUser(res: Response): Promise<void>;
    createUser(res: Response, req: Request): Promise<void>;
}
