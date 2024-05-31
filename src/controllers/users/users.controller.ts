import { Controller, Get, Header, Post, Put, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { success, failed } from "src/services/Response_config/main";
import { UsersService } from "src/services/users/users.service";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(":idUser")
  async getDetailUser(@Res() res: Response, @Req() req: Request) {
    return await this.userService.getUser(res, req);
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
  async createUserHandler(@Res() res: Response, @Req() req: Request) {
    return await this.userService.createUser(res, req);
  }

  @Post("login")
  async loginUserHandler(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.userService.loginUser(res, req);
  }

  @Put("updateUser/:usrName")
  @Header("content-type", "application/json")
  async updateUserHandler(@Res() res: Response, @Req() req: Request) {
    return this.userService.updateUser(res, req);
  }
}
