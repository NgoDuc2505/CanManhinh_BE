import { Injectable } from "@nestjs/common";
import { IUserSecure, IUserTokenDecode } from "src/interfaces/interfaces";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import {
  failureFl,
  serverErrorFl,
  successFl,
} from "src/services/Response_config/main";
import {
  createToken,
  verifyToken,
} from "src/services/Global_services/jwtToken_sv";
import { TOKEN, TOKEN_HEADER } from "src/const/const.type";
import UserInterface from "src/interfaces/interface.user";
import checkAuth from "../Authorization/Auth";
const prisma = new PrismaClient();

@Injectable()
export class UsersService implements UserInterface {
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

  static async isUserExited(usrName: string) {
    const data = await prisma.uSERTABLE.findUnique({
      where: {
        userName: usrName,
      },
    });
    if (data) {
      return { data, isExit: true };
    }
    return { data: null, isExit: false };
  }

  private async findDetailUserByUserName(usrNm: string) {
    return await prisma.uSERTABLE.findUnique({
      where: {
        userName: usrNm,
      },
    });
  }

  async getUser(res: Response, req: Request) {
    const { idUser } = req.params;
    console.log(idUser);
    try {
      const users: IUserSecure[] = await prisma.uSERTABLE.findMany({
        where: {
          userName: idUser,
        },
        select: this.exclude("password"),
      });
      if (users.length == 0) {
        failureFl(res, 400, "User not found...!");
      } else {
        successFl(res, users, "Founded user...!");
      }
    } catch (e) {
      serverErrorFl(res);
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
      const { isExit } = await UsersService.isUserExited(userName);
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
        successFl(res, rs, "Success signup...");
      } else {
        failureFl(res, 400, "Exited username...!");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async loginUser(res: Response, req: Request) {
    const { userName, passWord } = req.body;
    try {
      const { isExit, data } = await UsersService.isUserExited(userName);
      if (isExit) {
        const { password } = data;
        const isVerify = await this.checkPass(passWord, password);
        if (isVerify) {
          const token = createToken(data);
          res.cookie(TOKEN, token, {
            httpOnly: true,
            signed: false,
            path: "/",
            secure: true,
            maxAge: 60 * 60 * 1000,
          });
          successFl(res, { token, data }, "Success login...");
        } else {
          failureFl(res, 400, "Invalid password...!");
        }
      } else {
        failureFl(res, 400, "Invalid username...!");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async updateUser(res: Response, req: Request) {
    try {
      const reqH: string = req.headers[TOKEN_HEADER] as string;
      console.log(req.headers);
      const { usrName } = req.params;
      const { phone, dob, password, address } = req.body;
      console.log(req.body);
      const userDecodeToken: IUserTokenDecode = verifyToken(
        reqH,
      ) as IUserTokenDecode;
      if (userDecodeToken.userName === usrName) {
        const hashedPass = await this.hashPass(password);
        const updateUser = await prisma.uSERTABLE.update({
          where: {
            userName: usrName,
          },
          data: {
            address: address ? address : userDecodeToken.address,
            dob: dob ? dob : userDecodeToken.dob,
            password: password ? hashedPass : userDecodeToken.password,
            phone: phone ? phone : userDecodeToken.phone,
          },
        });
        const userAfterUpdate = await this.findDetailUserByUserName(usrName);
        const newToken = createToken(userAfterUpdate);
        successFl(
          res,
          { data: updateUser, token: newToken, usrName },
          "this is decode token...",
        );
      } else {
        failureFl(res, 400, "Invalid token, you not allow to do this...!");
      }
    } catch (e) {
      console.log(e)
      serverErrorFl(res);
    }
  }

  async updateUserRole(res: Response, req: Request) {
    try {
      const { usrName, roleName } = req.body;
      const token: string = req.headers[TOKEN_HEADER] as string;
      const userData = await UsersService.isUserExited(usrName);
      const isAuth = await checkAuth(token, prisma, req.path);
      console.log(isAuth);
      if (userData.isExit) {
        if (isAuth.status) {
          const roleUpdate = roleName === "ADMIN" ? 1 : 2;
          const data = await prisma.uSERTABLE.update({
            where: {
              userName: usrName,
            },
            data: {
              roleID: roleUpdate,
            },
          });
          successFl(res, data);
        } else {
          failureFl(res, 400, isAuth.msg);
        }
      } else {
        failureFl(res, 400, "Invalid username...");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
}
