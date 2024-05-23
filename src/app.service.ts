import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Sản phẩm thuộc về Ngô Minh Đức - Nguyễn Huy Hoàng.";
  }
}
