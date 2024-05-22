import { Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Response, Request } from "express";
import { success, failed } from "src/Response_config/main";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(":idUser")
  async getDetailUser(@Res() res: Response, @Param("idUser") id: string) {
    try {
      const data = await this.userService.getUser(id);
      success(res, data);
    } catch (e) {
      failed(res);
    }
  }

  @Get()
  async getAllUser(@Res() res: Response) {
    try {
      const data = await this.userService.getAllUser();
      success(res, data);
    } catch (e) {
      failed(res);
    }
  }

  @Post("create")
  async createUser(@Res() res: Response, @Req() req: Request) {
    try {
      const { userName, phone, dob, password, address } = req.body;
      const data = await this.userService.createUser({
        userName,
        phone,
        dob,
        password,
        address,
      });
      success(res, data);
    } catch (e) {
      // console.log(e);
      failed(res, "Username is exits...");
    }
  }
}
