import { Response } from "express";
declare const success: (res: Response, data: any) => Response<any, Record<string, any>>;
declare const failed: (res: Response, msg?: string) => Response<any, Record<string, any>>;
declare const serverInterrupt: (res: Response) => Response<any, Record<string, any>>;
declare const successFl: (res: Response, content: any, msg?: string) => Response<any, Record<string, any>>;
declare const failureFl: (res: Response, statusCode: number, msg: string) => Response<any, Record<string, any>>;
declare const serverErrorFl: (res: Response) => Response<any, Record<string, any>>;
export { success, failed, serverInterrupt, serverErrorFl, failureFl, successFl, };
