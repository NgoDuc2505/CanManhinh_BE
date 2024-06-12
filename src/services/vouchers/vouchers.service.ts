import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { VoucherServicesInterface } from "src/interfaces/interface.services";
import {
  failureFl,
  serverErrorFl,
  successFl,
} from "src/services/Response_config/main";
import { MSG_GLOBAL, ROLE, TOKEN_HEADER } from "src/const/const.type";
import checkAuth from "../Authorization/Auth";
import { verifyToken } from "../Global_services/jwtToken_sv";
import { IUserTokenDecode } from "src/interfaces/interfaces";

@Injectable()
export class VouchersService implements VoucherServicesInterface {
  private prisma = new PrismaClient();

  private MSGFOREXPDATE = {
    notExpired: "This voucher is still on date...",
    expired: "This voucher is expired, expired will be true...",
  };
  private async isExitVoucher(voucherId: string) {
    const data = await this.prisma.vOUCHERTABLE.findUnique({
      where: {
        voucherID: voucherId,
      },
    });
    console.log("check here:", data);
    if (data) {
      return true;
    } else {
      return false;
    }
  }
  private async getVoucher(voucherId: string) {
    const data = await this.prisma.vOUCHERTABLE.findUnique({
      where: {
        voucherID: voucherId,
      },
    });
    return data;
  }

  private seperateDateForm(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  private async setExpiredVoucher(state: boolean, voucherId: string) {
    const data = await this.prisma.vOUCHERTABLE.update({
      where: {
        voucherID: voucherId,
      },
      data: {
        isExpired: state,
      },
    });
    return data;
  }

  async getUserVoucher(res: Response, req: Request) {
    try {
      const { userName } = req.params;
      const data = await this.prisma.vOUCHEROFUSER.findMany({
        where: {
          userName,
          isUsed: false,
          VOUCHERTABLE: {
            isExpired: false,
          },
        },
        select: {
          VOUCHERTABLE: {
            select: {
              voucherID: true,
              voucherName: true,
              expiredDate: true,
              valuesVoucher: true,
            },
          },
        },
      });
      if (data.length != 0) {
        const mapData = data.map((item) => {
          return item.VOUCHERTABLE;
        });
        successFl(res, mapData);
      } else {
        successFl(res, []);
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async getVoucherList(res: Response, req: Request) {
    try {
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      if (userDecodeToken && userDecodeToken.roleID == ROLE.admin) {
        const data = await this.prisma.vOUCHERTABLE.findMany();
        successFl(res, data);
      } else {
        failureFl(res, 400, MSG_GLOBAL.error.notAllow);
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
  async addVoucher(res: Response, req: Request) {
    try {
      const { voucherId, voucherName, expiredDate, valuesVoucher } = req.body;
      if (!(await this.isExitVoucher(voucherId))) {
        const data = await this.prisma.vOUCHERTABLE.create({
          data: {
            voucherID: voucherId,
            voucherName,
            isExpired: false,
            expiredDate,
            valuesVoucher,
          },
        });
        successFl(res, data);
      } else {
        failureFl(res, 400, "Invalid Voucher ID ...!");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
  async deleteVoucher(res: Response, req: Request) {
    try {
      const { voucherId } = req.body;
      if (await this.isExitVoucher(voucherId)) {
        const data = await this.prisma.vOUCHERTABLE.delete({
          where: {
            voucherID: voucherId,
          },
        });
        successFl(res, data, "Voucher is deleted...!");
      } else {
        failureFl(res, 400, "Invalid voucher ID to be deleted...!");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async checkVoucherExpired(res: Response, req: Request) {
    try {
      const { voucherId } = req.body;
      const currentDate = new Date();
      const currentVoucher = await this.getVoucher(voucherId);
      const dateNow = this.seperateDateForm(currentDate);
      const dateVoucher = this.seperateDateForm(currentVoucher.expiredDate);
      if (dateNow.year <= dateVoucher.year) {
        if (dateNow.month < dateVoucher.month) {
          successFl(res, currentVoucher, this.MSGFOREXPDATE.notExpired);
        } else if (dateNow.month == dateVoucher.month) {
          if (dateNow.day <= dateVoucher.day) {
            successFl(res, currentVoucher, this.MSGFOREXPDATE.notExpired);
          } else {
            //set to true if current date > voucher date;
            const data = await this.setExpiredVoucher(true, voucherId);
            successFl(res, data, this.MSGFOREXPDATE.expired);
          }
        } else {
          //set to true if current month > voucher month;
          const data = await this.setExpiredVoucher(true, voucherId);
          successFl(res, data, this.MSGFOREXPDATE.expired);
        }
      } else {
        //set to true if current year > voucher year;
        const data = await this.setExpiredVoucher(true, voucherId);
        successFl(res, data, this.MSGFOREXPDATE.expired);
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async addUserVoucher(res: Response, req: Request) {
    try {
      const header: string = req.headers[TOKEN_HEADER] as string;
      const { status, msg } = await checkAuth(header, this.prisma, req.path);
      if (status) {
        const { usrName, voucherId } = req.body;
        //check is voucher is added to user
        const relationUsrNameAndVoucher =
          await this.prisma.vOUCHEROFUSER.findMany({
            where: {
              userName: usrName,
            },
          });
        const isExitIndex = relationUsrNameAndVoucher.findIndex((item) => {
          return item.voucherID === voucherId;
        });
        if (isExitIndex == -1) {
          const data = await this.prisma.vOUCHEROFUSER.create({
            data: {
              userName: usrName,
              voucherID: voucherId,
              isUsed: false,
            },
          });
          successFl(res, { data, authMsg: msg });
        } else {
          failureFl(res, 400, "This voucher has been added to this user...");
        }
      } else {
        failureFl(res, 404, msg);
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async setVoucherUsed(res: Response, req: Request) {
    try {
      const { voucherId, usrName } = req.body;
      const dataVoucherFind = await this.prisma.vOUCHEROFUSER.findMany({
        where: {
          voucherID: voucherId,
          userName: usrName,
        },
        select: {
          idOwn: true,
          isUsed: true,
        },
      });
      if (dataVoucherFind.length != 0) {
        const idGet = dataVoucherFind[0].idOwn;
        const setVoucherUsedData = await this.prisma.vOUCHEROFUSER.update({
          where: {
            idOwn: idGet,
          },
          data: {
            isUsed: true,
          },
        });
        successFl(res, setVoucherUsedData);
      } else {
        failureFl(res, 404, "Undefined voucher...");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
}
