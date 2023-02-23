import { TurnContext } from "botbuilder";
import { ComponentDialog } from "botbuilder-dialogs";
import { INodeSocket } from "botframework-streaming";
import { IncomingMessage } from "http";
import { StatusCodes } from "http-status-codes";
import { Duplex } from "node:stream";
import { Next, Request, Response } from "restify";

import MainHandler from "../bot/mainHandler";
import MainDialog from "../dialogs/mainDialog";
import BotFrameworkService from "../services/botFrameworkService";
import EnglishLangDialog from "../dialogs/EnglishLangDialog";
import AddUserDialog from "../dialogs/addUserDialog";

export default class BotController {
  private _botFrameworkService: BotFrameworkService;
  private _mainHandler: MainHandler;

  constructor() {
    this._botFrameworkService = new BotFrameworkService();
    const dialogs: Array<ComponentDialog> = [new EnglishLangDialog(),new AddUserDialog()];
    const mainDialog = new MainDialog(dialogs);
    this._mainHandler = new MainHandler(this._botFrameworkService, mainDialog);
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async optMessageHandler(_req: Request, res: Response, _next: Next): Promise<void> {
    return res.send(StatusCodes.ACCEPTED);
  }
  
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async postMessageHandler(req: Request, res: Response, _next: Next): Promise<void> {
    await this._botFrameworkService.adapter.process(req, res, (context: TurnContext) => this._mainHandler.run(context));
  }

  async messageListener(req: IncomingMessage, socket: Duplex, head: Buffer): Promise<void> {
    await this._botFrameworkService.adapter.process(req, socket as unknown as INodeSocket, head, (context: TurnContext) => this._mainHandler.run(context));
  }
}
