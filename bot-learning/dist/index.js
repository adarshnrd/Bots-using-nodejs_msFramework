"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
const http_status_codes_1 = require("http-status-codes");
const restify_1 = require("restify");
const constants_1 = __importDefault(require("./constants"));
const botController_1 = __importDefault(require("./controllers/botController"));
const port = process.env.PORT || "3978";
// Create HTTP server.
const server = (0, restify_1.createServer)();
// Middleware
server.use(restify_1.plugins.bodyParser());
// Bot Framework message message webhook route
const botController = new botController_1.default();
server.opts(constants_1.default.ROUTER_PATH.BOT_FRAMEWORK_MESSAGE_WEBHOOK, (...arg) => botController.optMessageHandler(...arg));
server.post(constants_1.default.ROUTER_PATH.BOT_FRAMEWORK_MESSAGE_WEBHOOK, (...arg) => botController.postMessageHandler(...arg));
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
server.on("restifyError", (req, res, error, _next) => {
    return res.send(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
});
// Start server
server.listen(port, () => {
    console.log(`${server.name} listening to ${server.url}.`);
});
//# sourceMappingURL=index.js.map