import { Injectable } from "@nestjs/common";
import { Response, Request } from "express";
import BookingInterface from "src/interfaces/interface.booking";
import {
  failureFl,
  serverErrorFl,
  successFl,
} from "src/services/Response_config/main";
import { UsersService } from "../users/users.service";
import { PrismaClient } from "@prisma/client";
import { MSG_GLOBAL, ROLE, TOKEN_HEADER } from "src/const/const.type";
import { IUserTokenDecode } from "src/interfaces/interfaces";
import { verifyToken } from "../Global_services/jwtToken_sv";

@Injectable()
export class BookingService implements BookingInterface {
  private prisma = new PrismaClient();

  private checkTokenMapUsrName(token: string, usrName: string) {
    const userDecodeToken: IUserTokenDecode = verifyToken(
      token,
    ) as IUserTokenDecode;
    if (userDecodeToken && userDecodeToken.userName === usrName) {
      return {
        data: userDecodeToken,
        status: true,
      };
    } else {
      return {
        data: userDecodeToken,
        status: false,
      };
    }
  }
  private async isExitBookingId(bookingId: string) {
    const bookingIdNumberConverter = Number.parseInt(bookingId);
    const isExitrBookingId = await this.prisma.bOOKINGTABLE.findUnique({
      where: {
        bookingID: bookingIdNumberConverter,
      },
    });
    if (isExitrBookingId) {
      return {
        data: isExitrBookingId,
        status: true,
      };
    } else {
      return {
        data: isExitrBookingId,
        status: false,
      };
    }
  }
  private async getBookingListByUsrName(usrName: string) {
    const dataList = await this.prisma.bOOKINGTABLE.findMany({
      where: {
        userName: usrName,
      },
    });
    return dataList;
  }
  private checkTimeBook(time: string) {
    // "2024-06-25T08:35:29.000Z"
    const resultStatus = {
      mgs: "",
      status: false,
    };
    const dateNow = new Date();
    const factoryTimeArray = time.split("T")[0].split("-");
    const factoryTime = {
      year: Number.parseInt(factoryTimeArray[0]),
      month: Number.parseInt(factoryTimeArray[1]),
      date: Number.parseInt(factoryTimeArray[2]),
    };
    console.log(dateNow, factoryTime);
    if (dateNow.getFullYear() < factoryTime.year) {
      resultStatus.mgs = "Ok";
      resultStatus.status = true;
    } else if (dateNow.getFullYear() == factoryTime.year) {
      if (dateNow.getMonth() + 1 < factoryTime.month) {
        resultStatus.mgs = "Ok";
        resultStatus.status = true;
      } else if (dateNow.getMonth() + 1 == factoryTime.month) {
        if (dateNow.getDate() <= factoryTime.date) {
          resultStatus.mgs = "Ok";
          resultStatus.status = true;
        } else {
          resultStatus.mgs = "Date booking is invalid...";
          resultStatus.status = false;
        }
      } else {
        resultStatus.mgs = "Month booking is invalid...";
        resultStatus.status = false;
      }
    } else {
      resultStatus.mgs = "Year booking is invalid...";
      resultStatus.status = false;
    }

    return resultStatus;
  }
  private async setUsedVoucher(idOwn: number) {
    console.log("idOwn fc: ", idOwn);
    const data = await this.prisma.vOUCHEROFUSER.update({
      where: {
        idOwn: idOwn,
      },
      data: {
        isUsed: true,
      },
    });
    console.log("data fc", data);
    return data;
  }
  private async checkVoucherIsValid(voucherId: string, usrName: string) {
    if (voucherId === "") {
      return {
        data: null,
        status: true,
      };
    }
    const data = await this.prisma.vOUCHEROFUSER.findMany({
      where: {
        userName: usrName,
        isUsed: false,
      },
    });
    const isValidIndex = data.findIndex((item) => {
      return item.voucherID === voucherId;
    });
    console.log("isValidIndex", isValidIndex);
    if (isValidIndex != -1) {
      await this.setUsedVoucher(data[isValidIndex].idOwn);
      return {
        data: voucherId,
        status: true,
      };
    } else {
      return {
        data: voucherId,
        status: false,
      };
    }
  }
  async booking(res: Response, req: Request) {
    try {
      const {
        usrName,
        fullName,
        address,
        phone,
        timeBook,
        note,
        voucherID,
        total,
      } = req.body;
      const isUserExit = await UsersService.isUserExited(usrName);
      if (isUserExit.isExit) {
        const timeBookChecker = this.checkTimeBook(timeBook);
        if (timeBookChecker.status) {
          const isValidVoucher = await this.checkVoucherIsValid(
            voucherID,
            usrName,
          );
          if (isValidVoucher.status) {
            const data = await this.prisma.bOOKINGTABLE.create({
              data: {
                userName: usrName,
                fullName: fullName,
                adress: address,
                phone: phone,
                timeBook: timeBook,
                voucherID: isValidVoucher.data,
                isDeleted: false,
                note: note,
                Total: +total,
              },
            });
            const listData = await this.getBookingListByUsrName(usrName);
            successFl(res, { currentData: data, listData });
          } else {
            failureFl(res, 404, MSG_GLOBAL.error.invalidVoucher);
          }
        } else {
          failureFl(res, 404, timeBookChecker.mgs);
        }
      } else {
        failureFl(res, 404, "Invalid Username...");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async getBookingList(res: Response, req: Request) {
    try {
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      const { usrName } = req.params;
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      console.log("userDecodeToken", userDecodeToken);
      if (userDecodeToken && userDecodeToken.userName === usrName) {
        if (userDecodeToken.roleID == ROLE.admin) {
          const data = await this.prisma.bOOKINGTABLE.findMany();
          successFl(res, data);
        } else {
          failureFl(res, 400, MSG_GLOBAL.error.notAllow);
        }
      } else {
        const isExitUser = await UsersService.isUserExited(usrName);
        if (isExitUser.isExit) {
          failureFl(res, 400, MSG_GLOBAL.error.inValidToken);
        } else {
          failureFl(res, 400, MSG_GLOBAL.error.invalidUserName);
        }
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async getBookingListUser(res: Response, req: Request) {
    try {
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      const { usrName } = req.params;
      const dataTokenChecker = this.checkTokenMapUsrName(reqH, usrName);
      if (dataTokenChecker.status) {
        const data = await this.prisma.bOOKINGTABLE.findMany({
          where: {
            userName: usrName,
            isDeleted: false,
          },
        });
        successFl(res, data);
      } else {
        console.log("usrName", usrName);
        const isExitUser = await UsersService.isUserExited(usrName);
        if (isExitUser.isExit) {
          failureFl(res, 400, MSG_GLOBAL.error.inValidToken);
        } else {
          failureFl(res, 400, MSG_GLOBAL.error.invalidUserName);
        }
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async delBooking(res: Response, req: Request) {
    try {
      const { bookingId } = req.params;
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      const dataBookingIdChecker = await this.isExitBookingId(bookingId);
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      if (dataBookingIdChecker.status) {
        if (userDecodeToken.roleID === ROLE.admin) {
          successFl(res, { bookingId, reqH });
        } else {
          failureFl(res, 404, MSG_GLOBAL.error.notAAdmin);
        }
      } else {
        failureFl(res, 404, MSG_GLOBAL.error.invalidBookingId);
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
  async setIsDone(res: Response, req: Request) {
    try {
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      const { usrName, bookingId, status } = req.body;
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      if (userDecodeToken && userDecodeToken.userName === usrName) {
        if (userDecodeToken.roleID == ROLE.admin) {
          const data = await this.prisma.bOOKINGTABLE.update({
            where:{
              bookingID: +bookingId
            },
            data:{
              isDone: status === "true" ? true : null
            }
          });
          const dataAfterUpdate = await this.prisma.bOOKINGTABLE.findMany();
          successFl(res, {data, dataAfterUpdate});
        } else {
          failureFl(res, 400, MSG_GLOBAL.error.notAllow);
        }
      } else {
        const isExitUser = await UsersService.isUserExited(usrName);
        if (isExitUser.isExit) {
          failureFl(res, 400, MSG_GLOBAL.error.inValidToken);
        } else {
          failureFl(res, 400, MSG_GLOBAL.error.invalidUserName);
        }
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
  async getIncomeMonth(res: Response, req: Request) {}

  async setIsDelBooking(res: Response, req: Request) {
    try {
      const { bookingId } = req.params;
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      const { usrName } = req.body;
      const tokenCheckerData = this.checkTokenMapUsrName(reqH, usrName);
      const bookingIdCheckerData = await this.isExitBookingId(bookingId);
      if (bookingIdCheckerData.status) {
        if (tokenCheckerData.status) {
          if (bookingIdCheckerData.data.userName === usrName) {
            const data = await this.prisma.bOOKINGTABLE.update({
              where: {
                bookingID: Number.parseInt(bookingId),
              },
              data: {
                isDeleted: true,
              },
            });
            successFl(res, data);
          } else {
            failureFl(res, 400, MSG_GLOBAL.error.notAllow);
          }
        } else {
          failureFl(res, 400, MSG_GLOBAL.error.inValidToken);
        }
      } else {
        failureFl(res, 400, MSG_GLOBAL.error.invalidBookingId);
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
}
