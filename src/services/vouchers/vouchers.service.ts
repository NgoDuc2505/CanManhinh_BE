import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { VoucherServicesInterface } from "src/interfaces/interface.services";
import {
  failureFl,
  serverErrorFl,
  successFl,
} from "src/services/Response_config/main";

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

  private async checkVoucherExpiredAndSetVoucher(voucherId: string) {
    try {
      const resultData = {
        isExpired: false,
        data: {},
      };
      const currentDate = new Date();
      const currentVoucher = await this.getVoucher(voucherId);
      const dateNow = this.seperateDateForm(currentDate);
      const dateVoucher = this.seperateDateForm(currentVoucher.expiredDate);
      if (dateNow.year <= dateVoucher.year) {
        if (dateNow.month < dateVoucher.month) {
          resultData.isExpired = false;
          resultData.data = currentVoucher;
        } else if (dateNow.month == dateVoucher.month) {
          if (dateNow.day <= dateVoucher.day) {
            resultData.isExpired = false;
            resultData.data = currentVoucher;
          } else {
            //set to true if current date > voucher date;
            const data = await this.setExpiredVoucher(true, voucherId);
            resultData.isExpired = true;
            resultData.data = data;
          }
        } else {
          //set to true if current month > voucher month;
          const data = await this.setExpiredVoucher(true, voucherId);
          resultData.isExpired = true;
          resultData.data = data;
        }
      } else {
        //set to true if current year > voucher year;
        const data = await this.setExpiredVoucher(true, voucherId);
        resultData.isExpired = true;
        resultData.data = data;
      }
      return resultData;
    } catch (e) {
      console.log(e);
    }
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
      const { userName } = req.body;
      const data = await this.prisma.vOUCHEROFUSER.findMany({
        where: {
          userName,
          isUsed: false,
        },
        select: {
          VOUCHERTABLE: {
            select: {
              voucherID: true,
              voucherName: true,
              expiredDate: true,
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
      const { isGetExpired } = req.body;
      const isExpiredParam = isGetExpired ? true : false;
      const data = await this.prisma.vOUCHERTABLE.findMany({
        where: {
          isExpired: isExpiredParam,
        },
      });
      successFl(res, data);
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
}
