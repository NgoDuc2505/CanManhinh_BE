import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import {
  failureFl,
  serverErrorFl,
  successFl,
} from "src/services/Response_config/main";
import RoleInterface from "src/interfaces/interface.role";

@Injectable()
export class RoleService implements RoleInterface {
  private prisma = new PrismaClient();
  private isPathExitOnGrpTable = async (pathName: string) => {
    const data = await this.prisma.gROUPTABLE.findMany({
      where: {
        PathName: pathName,
      },
    });
    console.log("data length", data.length);
    if (data.length == 0) {
      return {
        status: true,
        data: data,
      };
    } else {
      return {
        status: false,
        data: data,
      };
    }
  };

  async addGroup(res: Response, req: Request) {
    try {
      const { pathName, describe } = req.body;
      const isExit = await this.isPathExitOnGrpTable(pathName);
      if (isExit.status) {
        const data = await this.prisma.gROUPTABLE.create({
          data: {
            PathName: pathName,
            describ: describe,
          },
        });
        successFl(res, data);
      } else {
        failureFl(res, 400, "path name is exit...h");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }

  async addGroupRole(res: Response, req: Request) {
    try {
      const { roleId, groupId } = req.body;
      const dataFind = await this.prisma.gROUPROLE.findMany({
        where: {
          RoleId: roleId,
          GroupId: groupId,
        },
        select: {
          GROUPTABLE: {
            select: {
              PathName: true,
              describ: true,
            },
          },
        },
      });
      if (dataFind.length == 0) {
        const data = await this.prisma.gROUPROLE.create({
          data: {
            RoleId: roleId,
            GroupId: groupId,
          },
        });
        const dataGetter = await this.prisma.gROUPROLE.findMany({
          where: {
            RoleId: roleId,
            GroupId: groupId,
          },
          select: {
            RoleId: true,
            GROUPTABLE: {
              select: {
                PathName: true,
                describ: true,
              },
            },
          },
        });
        successFl(res, dataGetter);
      } else {
        failureFl(res, 400, "Group role is exit...");
      }
    } catch (e) {
      console.log(e);
      serverErrorFl(res);
    }
  }
}
