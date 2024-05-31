import { Controller, Delete, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { VouchersService } from "src/services/vouchers/vouchers.service";

@Controller("vouchers")
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Get("getAll")
  async getAllList(@Res() res: Response, @Req() req: Request) {
    return await this.vouchersService.getVoucherList(res, req);
  }

  @Post("add")
  async addVoucher(@Res() res: Response, @Req() req: Request) {
    return await this.vouchersService.addVoucher(res, req);
  }

  @Delete("del")
  async deleteVoucher(@Res() res: Response, @Req() req: Request) {
    return await this.vouchersService.deleteVoucher(res, req);
  }
}
