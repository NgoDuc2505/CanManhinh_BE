"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG_GLOBAL = exports.ROLE = exports.TOKEN_HEADER = exports.TOKEN = void 0;
const TOKEN = "token_login";
exports.TOKEN = TOKEN;
const TOKEN_HEADER = "token_header";
exports.TOKEN_HEADER = TOKEN_HEADER;
const ROLE = {
    admin: 1,
    user: 2,
};
exports.ROLE = ROLE;
const MSG_GLOBAL = {
    success: {},
    error: {
        inValidToken: "Invalid token, you not allow to do this...!",
        invalidUserName: "Invalid Username...",
        notAllow: "Account permissions are not allowed...",
        invalidVoucher: "Invalid voucher..."
    }
};
exports.MSG_GLOBAL = MSG_GLOBAL;
//# sourceMappingURL=const.type.js.map