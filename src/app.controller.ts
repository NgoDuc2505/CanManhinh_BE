import { Controller, Get, Param, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { objectTestAndId } from "./const/const.type";
import { Response} from 'express';
import { success } from "./Response_config/main";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("test")
  test(): string[] {
    return this.appService.getTest();
  }

  @Get("object")
  objectTest(@Res() res: Response) {
    success(res,this.appService.getObject());
  }

  @Get('object/:id')
  objectWithId(@Param('id') id: string): objectTestAndId {
    return this.appService.testParam(id);
  }
}
