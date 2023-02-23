"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
class MainHandler extends botbuilder_1.ActivityHandler {
    _conversationState;
    _dialog;
    _dialogState;
    _userState;
    constructor(botFrameworkService, dialog) {
        super();
        if (!botFrameworkService)
            throw new Error("MainHandler.constructor: Missing parameter 'botFrameworkService' is required");
        if (!dialog)
            throw new Error("MainHandler.constructor: Missing parameter 'dialog' is required");
        this._conversationState = botFrameworkService.conversationState;
        this._userState = botFrameworkService.userState;
        this._dialog = dialog;
        this._dialogState = this._conversationState.createProperty("DialogState");
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded || [];
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    const welcomeText = "Hi, How may I help you?";
                    await context.sendActivity(welcomeText);
                    await this._dialog.run(context, this._dialogState);
                }
            }
            await next();
        });
        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            await this._dialog.run(context, this._dialogState);
            await next();
        });
        this.onDialog(async (context, next) => {
            await this._conversationState.saveChanges(context, false);
            await this._userState.saveChanges(context, false);
            await next();
        });
    }
}
exports.default = MainHandler;
//# sourceMappingURL=mainHandler.js.map