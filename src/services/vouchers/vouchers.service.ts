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

  async getUserVoucher() {}

  async getVoucherList(res: Response, req: Request) {
    try {
      console.log(req);
      const data = await this.prisma.vOUCHERTABLE.findMany({
        where: {
          isExpired: false,
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
      //valuesVoucher:string menh gia theo VND. ex: "100000" -> 100k
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

  async setVoucherExpired(res: Response, req: Request) {
    try {
      console.log(req);
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
}
