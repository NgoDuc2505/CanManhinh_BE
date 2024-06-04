import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersService } from "./services/users/users.service";
import { UsersController } from "./controllers/users/users.controller";
import { VouchersController } from "./controllers/vouchers/vouchers.controller";
import { VouchersService } from "./services/vouchers/vouchers.service";
import { BookingController } from "./controllers/booking/booking.controller";
import { BookingService } from "./services/booking/booking.service";
import { RoleController } from './controllers/role/role.controller';
import { RoleService } from './services/role/role.service';



@Module({
  imports: [],
  controllers: [AppController, UsersController, VouchersController, BookingController, RoleController],
  providers: [AppService, UsersService, VouchersService, BookingService, RoleService],
})
export class AppModule {}
