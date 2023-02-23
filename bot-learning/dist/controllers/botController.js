"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const mainHandler_1 = __importDefault(require("../bot/mainHandler"));
const mainDialog_1 = __importDefault(require("../dialogs/mainDialog"));
const botFrameworkService_1 = __importDefault(require("../services/botFrameworkService"));
const EnglishLangDialog_1 = __importDefault(require("../dialogs/EnglishLangDialog"));
const addUserDialog_1 = __importDefault(require("../dialogs/addUserDialog"));
class BotController {
    _botFrameworkService;
    _mainHandler;
    constructor() {
        this._botFrameworkService = new botFrameworkService_1.default();
        const dialogs = [new EnglishLangDialog_1.default(), new addUserDialog_1.default()];
        const mainDialog = new mainDialog_1.default(dialogs);
        this._mainHandler = new mainHandler_1.default(this._botFrameworkService, mainDialog);
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    async optMessageHandler(_req, res, _next) {
        return res.send(http_status_codes_1.StatusCodes.ACCEPTED);
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    async postMessageHandler(req, res, _next) {
        await this._botFrameworkService.adapter.process(req, res, (context) => this._mainHandler.run(context));
    }
    async messageListener(req, socket, head) {
        await this._botFrameworkService.adapter.process(req, socket, head, (context) => this._mainHandler.run(context));
    }
}
exports.default = BotController;
//# sourceMappingURL=botController.js.map