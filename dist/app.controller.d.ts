import { AppService } from "./app.service";
import { objectTestAndId } from "./const/const.type";
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    test(): string[];
    objectTest(res: Response): void;
    objectWithId(id: string): objectTestAndId;
}
