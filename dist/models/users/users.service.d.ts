import { IUserSecure, IUserCreateData } from "src/interfaces/interfaces";
export declare class UsersService {
    private salt;
    private exclude;
    private hashPass;
    private checkPass;
    private isUserExited;
    getUser(id: string): Promise<IUserSecure[] | null>;
    getAllUser(): Promise<IUserSecure[] | null>;
    createUser(data: IUserCreateData): Promise<IUserSecure>;
}
