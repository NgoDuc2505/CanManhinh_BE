"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_service_1 = require("./models/users/users.service");
const users_controller_1 = require("./models/users/users.controller");
const vouchers_controller_1 = require("./controllers/vouchers/vouchers.controller");
const vouchers_service_1 = require("./services/vouchers/vouchers.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, users_controller_1.UsersController, vouchers_controller_1.VouchersController],
        providers: [app_service_1.AppService, users_service_1.UsersService, vouchers_service_1.VouchersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map