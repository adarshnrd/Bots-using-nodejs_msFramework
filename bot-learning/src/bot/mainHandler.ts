import { ActivityHandler, BotState, StatePropertyAccessor, TurnContext } from "botbuilder";
import { Dialog, DialogState } from "botbuilder-dialogs";

import MainDialog from "../dialogs/mainDialog";
import BotFrameworkService from "../services/botFrameworkService";

export default class MainHandler extends ActivityHandler {
  private _conversationState: BotState;
  private _dialog: Dialog;
  private _dialogState: StatePropertyAccessor<DialogState>;

  private _userState: BotState;

  constructor(botFrameworkService: BotFrameworkService, dialog: Dialog) {
    super();
    if (!botFrameworkService) throw new Error("MainHandler.constructor: Missing parameter 'botFrameworkService' is required");
    if (!dialog) throw new Error("MainHandler.constructor: Missing parameter 'dialog' is required");

    this._conversationState = botFrameworkService.conversationState;
    this._userState = botFrameworkService.userState;
    this._dialog = dialog;
    this._dialogState = this._conversationState.createProperty("DialogState");

    this.onMembersAdded(async (context: TurnContext, next: () => Promise<void>): Promise<void> => {
      const membersAdded = context.activity.membersAdded || [];
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          const welcomeText =
            "Hi, How may I help you?";
          await context.sendActivity(welcomeText);
          await (this._dialog as MainDialog).run(context, this._dialogState);
        }
      }
      await next();
    });

    this.onMessage(async (context: TurnContext, next: () => Promise<void>): Promise<void> => {
      console.log('Running dialog with Message Activity.');
      await (this._dialog as MainDialog).run(context, this._dialogState);
      await next();
    });

    this.onDialog(async (context: TurnContext, next: () => Promise<void>): Promise<void> => {
      await this._conversationState.saveChanges(context, false);
      await this._userState.saveChanges(context, false);
      await next();
    });
  }
}
