"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successFl = exports.failureFl = exports.serverErrorFl = exports.serverInterrupt = exports.failed = exports.success = void 0;
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
const successFl = (res, content, msg = "success") => {
    return res.status(200).json({
        statusCode: 200,
        content,
        msg,
        date: new Date(),
    });
};
exports.successFl = successFl;
const failureFl = (res, statusCode, msg) => {
    return res.status(statusCode).json({
        statusCode,
        content: [],
        msg,
        date: new Date(),
    });
};
exports.failureFl = failureFl;
const serverErrorFl = (res) => {
    return res.status(500).json({
        statusCode: 500,
        content: [],
        msg: "BE ERROR",
        date: new Date(),
    });
};
exports.serverErrorFl = serverErrorFl;
//# sourceMappingURL=main.js.map