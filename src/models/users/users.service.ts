import { Injectable } from "@nestjs/common";
import { IUser, IUserSecure, IUserCreateData } from "src/interfaces/interfaces";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

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
      return true;
    }
    return false;
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

  async createUser(data: IUserCreateData): Promise<IUserSecure> {
    const { userName, phone, dob, password, address } = data;
    const hashedPass = await this.hashPass(password);
    const currentDate = new Date().toISOString();
    // const fullDateData = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}T${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}.000Z`;
    try {
      const isExited = await this.isUserExited(userName);
      if (!isExited) {
        const rs = prisma.uSERTABLE.create({
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
        return rs;
      }else{
        throw new Error("User has exited !")
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
