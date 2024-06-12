import { Controller, Delete, Get, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { BookingService } from "src/services/booking/booking.service";

@Controller("booking")
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Post("add")
  async booking(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.booking(res, req);
  }

  @Get("allList/:usrName")
  async getBookingList(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.getBookingList(res, req);
  }

  @Get("listUser/:usrName")
  async getBookingListUser(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.getBookingListUser(res, req);
  }

  @Put("setIsDel/:bookingId")
  async setIsDelBooking(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.setIsDelBooking(res, req);
  }

  @Delete("delBooking/:bookingId")
  async delBooking(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.delBooking(res, req);
  }

  @Put("setIsDone")
  async setIsDone(@Res() res: Response, @Req() req: Request) {
    return await this.bookingService.setIsDone(res, req);
  }
}
