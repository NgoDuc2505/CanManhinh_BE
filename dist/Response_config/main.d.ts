import { Response } from "express";
declare const success: (res: Response, data: any) => Response<any, Record<string, any>>;
declare const failed: (res: Response, msg?: string) => Response<any, Record<string, any>>;
declare const serverInterrupt: (res: Response) => Response<any, Record<string, any>>;
export { success, failed, serverInterrupt };
