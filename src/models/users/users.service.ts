import { Injectable } from "@nestjs/common";
import { IUserSecure } from "src/interfaces/interfaces";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { failureFl, serverErrorFl, successFl } from "src/Response_config/main";
import { createToken } from "src/Global_services/jwtToken_sv";
import { TOKEN } from "src/const/const.type";
const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  private salt = 10;
  private exclude(field: string) {
    const dataChecker = {
      address: true,
      phone: true,
      roleID: true,
      dob: true,
      userName: true,
      dayCreated: true,
      password: true,
    };
    dataChecker[field] = false;
    return dataChecker;
  }

  private async hashPass(pass: string) {
    return await bcrypt.hash(pass, this.salt);
  }

  private async checkPass(pass: string, hash: any) {
    return await bcrypt.compare(pass, hash);
  }

  private async isUserExited(usrName: string) {
    const data = await prisma.uSERTABLE.findUnique({
      where: {
        userName: usrName,
      },
    });
    if (data) {
      return {data, isExit: true};
    }
    return {data: null, isExit: false};
  }

  async getUser(id: string): Promise<IUserSecure[] | null> {
    console.log(id);
    try {
      const users: IUserSecure[] = await prisma.uSERTABLE.findMany({
        where: {
          userName: id,
        },
        select: this.exclude("password"),
      });
      if (users.length == 0) {
        throw new Error("Not found!");
      }
      return users;
    } catch (e) {
      throw new Error("Not found!");
    }
  }

  async getAllUser(): Promise<IUserSecure[] | null> {
    try {
      const users: IUserSecure[] = await prisma.uSERTABLE.findMany({
        select: this.exclude("password"),
      });
      return users;
    } catch (e) {
      throw new Error("Not found!");
    }
  }

  async createUser(res: Response, req: Request) {
    const { userName, phone, dob, password, address } = req.body;
    const hashedPass = await this.hashPass(password);
    const currentDate = new Date().toISOString();
    try {
      const {isExit} = await this.isUserExited(userName);
      if (!isExit) {
        const rs = await prisma.uSERTABLE.create({
          data: {
            userName,
            phone,
            dob,
            dayCreated: currentDate,
            password: hashedPass,
            roleID: 2,
            address,
          },
        });
        successFl(res,rs,"Success signup...");
      } else {
        failureFl(res,400,"Exited username...!");
      }
    } catch (e) {
      console.log(e)
      serverErrorFl(res);
    }
  }

  async loginUser(res: Response, req: Request) {
    const {userName, passWord} = req.body;
    try{
      const {isExit, data} = await this.isUserExited(userName);
      if(isExit){
        const {password} = data;
        const isVerify = await this.checkPass(passWord,password);
        if(isVerify){
          const token = createToken(data);
          res.cookie(TOKEN,token,{httpOnly: true, signed: false, path:"/",secure: true, maxAge: 60*60*1000});
          successFl(res,{token,roleId: data.roleID},"Success login...");
        }else{
          failureFl(res,400,"Invalid password...!");
        }
      }else{
        failureFl(res,400,"Invalid username...!");
      }
    }catch(e){
      console.log(e)
      serverErrorFl(res);
    }
  }
}
