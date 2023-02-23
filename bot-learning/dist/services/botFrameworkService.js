"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
class BotFrameworkService {
    _cloudAdapter;
    _conversationState;
    _userState;
    constructor() {
        const factoryOptions = {
            MicrosoftAppId: process.env.MICROSOFT_APP_ID,
            MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
            MicrosoftAppTenantId: process.env.MICROSOFT_APP_TENANT_ID,
            MicrosoftAppType: process.env.MICROSOFT_APP_TYPE,
        };
        const credentialsFactory = new botbuilder_1.ConfigurationServiceClientCredentialFactory(factoryOptions);
        const botFrameworkAuthentication = (0, botbuilder_1.createBotFrameworkAuthenticationFromConfiguration)(null, credentialsFactory);
        const memoryStorage = new botbuilder_1.MemoryStorage();
        this._conversationState = new botbuilder_1.ConversationState(memoryStorage);
        this._userState = new botbuilder_1.UserState(memoryStorage);
        this._cloudAdapter = new botbuilder_1.CloudAdapter(botFrameworkAuthentication);
        this._registerOnTurnError(this._cloudAdapter);
    }
    get adapter() {
        return this._cloudAdapter;
    }
    get conversationState() {
        return this._conversationState;
    }
    get userState() {
        return this._userState;
    }
    _registerOnTurnError(adapter) {
        adapter.onTurnError = async (context, error) => {
            console.log(`\n [onTurnError] unhandled error: ${error}`);
            await context.sendTraceActivity("OnTurnError Trace", `${error}`, "https://www.botframework.com/schemas/error", "TurnError");
            // Send a message to the user
            await context.sendActivity("The bot encounted an error or bug.");
            await context.sendActivity("To continue to run this bot, please fix the bot source code.");
            await this._conversationState.delete(context);
        };
    }
}
exports.default = BotFrameworkService;
//# sourceMappingURL=botFrameworkService.js.map