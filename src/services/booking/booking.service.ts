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
      const { usrName } = req.body;
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      if (userDecodeToken.userName === usrName) {
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
      const { usrName } = req.body;
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      if (userDecodeToken.userName === usrName) {
        const data = await this.prisma.bOOKINGTABLE.findMany({
          where: {
            userName: usrName,
            isDeleted: false,
          },
        });
        successFl(res, data);
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

  async delBooking(res: Response, req: Request) {}

  async getIncomeMonth(res: Response, req: Request) {}
}
