import { Request, Response } from "express"

interface VoucherServicesInterface {
    getUserVoucher(res: Response, req: Request),
    getVoucherList(res: Response, req: Request),
    addVoucher(res: Response, req: Request),
    deleteVoucher(res: Response, req: Request),
    checkVoucherExpired(res: Response, req: Request),
}
export {VoucherServicesInterface}