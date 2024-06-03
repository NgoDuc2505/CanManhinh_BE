import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { RoleService } from "src/services/role/role.service";

@Controller("role")
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post("addGrp")
  async addGroup(@Res() res: Response, @Req() req: Request) {
    return await this.roleService.addGroup(res, req);
  }

  @Post("addGroupRole")
  async addGroupRole(@Res() res: Response, @Req() req: Request) {
    return await this.roleService.addGroupRole(res, req);
  }
}
