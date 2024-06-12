import { Request, Response } from "express";

interface BookingInterface {
  booking(res: Response, req: Request);
  getBookingList(res: Response, req: Request);
  getBookingListUser(res: Response, req: Request);
  delBooking(res: Response, req: Request);
  getIncomeMonth(res: Response, req: Request);
  setIsDelBooking(res: Response, req: Request);
  setIsDone(res: Response, req: Request);
}

export default BookingInterface;
