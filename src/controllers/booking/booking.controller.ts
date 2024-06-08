import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { BookingService } from "src/services/booking/booking.service";

@Controller("booking")
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Post("add")
  async booking(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.booking(res, req);
  }

  @Get("allList")
  async getBookingList(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.getBookingList(res, req);
  }

  @Get("listUser")
  async getBookingListUser(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.getBookingListUser(res, req);
  }


}
