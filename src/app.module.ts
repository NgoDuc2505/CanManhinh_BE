import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersService } from './models/users/users.service';
import { UsersController } from './models/users/users.controller';
import { VouchersController } from './controllers/vouchers/vouchers.controller';
import { VouchersService } from './services/vouchers/vouchers.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, VouchersController],
  providers: [AppService, UsersService, VouchersService],
})
export class AppModule {}
