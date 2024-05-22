import { objectTest, objectTestAndId } from "./const/const.type";
export declare class AppService {
    getHello(): string;
    getTest(): string[];
    getObject(): objectTest;
    testParam(id: string): objectTestAndId;
}
