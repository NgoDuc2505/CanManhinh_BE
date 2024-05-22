"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInterrupt = exports.failed = exports.success = void 0;
const success = (res, data) => {
    return res.status(200).json({ data, msg: "success", status: res.statusCode });
};
exports.success = success;
const failed = (res, msg = "Bad request !") => {
    return res.status(400).json({ data: [], msg });
};
exports.failed = failed;
const serverInterrupt = (res) => {
    return res.status(500).json({ data: [], msg: "SERVER ERROR 500" });
};
exports.serverInterrupt = serverInterrupt;
//# sourceMappingURL=main.js.map