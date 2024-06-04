import { IUserTokenDecode } from "src/interfaces/interfaces";
import { verifyToken } from "../Global_services/jwtToken_sv";
import { PrismaClient } from "@prisma/client";

const result = (status: boolean, msg: string) => {
  return {
    status,
    msg,
  };
};

const checkAuth = async (
  token: string,
  prisma: PrismaClient,
  currentPath: string,
) => {
  const decodeToken: IUserTokenDecode = verifyToken(token) as IUserTokenDecode;
  if (decodeToken) {
    const { roleID } = decodeToken;
    const grouprole = await prisma.gROUPROLE.findMany({
      where: {
        RoleId: roleID,
      },
      select: {
        RoleId: true,
        GROUPTABLE: {
          select: {
            describ: true,
            PathName: true,
          },
        },
        ROLE: {
          select: {
            roleName: true,
          },
        },
      },
    });
    const isValidAccount = grouprole.findIndex((item) => {
      return item.GROUPTABLE.PathName === currentPath;
    });
    if (isValidAccount >= 0) {
      return result(true, "Authorized...");
    }
    return result(false, "Account dont have permission...");
  } else {
    return result(false, "Invalid token...");
  }
};

export default checkAuth;
