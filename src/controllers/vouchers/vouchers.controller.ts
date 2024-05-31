import { Controller, Delete, Get, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { VouchersService } from "src/services/vouchers/vouchers.service";

@Controller("vouchers")
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Get("getAll")
  async getAllList(@Res() res: Response, @Req() req: Request) {
    //isGetExpired param body == unset : get unexpired list , set : get expired list
    return await this.vouchersService.getVoucherList(res, req);
  }

  @Post("add")
  async addVoucher(@Res() res: Response, @Req() req: Request) {
    //valuesVoucher:string menh gia theo VND. ex: "100000" -> 100k
    return await this.vouchersService.addVoucher(res, req);
  }

  @Delete("del")
  async deleteVoucher(@Res() res: Response, @Req() req: Request) {
    return await this.vouchersService.deleteVoucher(res, req);
  }

  @Put("setExpired")
  async setExpired(@Res() res: Response, @Req() req: Request) {
    return await this.vouchersService.checkVoucherExpired(res, req);
  }

  @Get("userVoucher")
  async getUserVoucher(@Res() res: Response, @Req() req: Request) {
    return await this.vouchersService.getUserVoucher(res, req);
  }
}
