import { CloudAdapter, ConfigurationServiceClientCredentialFactory, ConversationState, createBotFrameworkAuthenticationFromConfiguration, MemoryStorage, TurnContext, UserState } from "botbuilder";


export default class BotFrameworkService {
  private _cloudAdapter: CloudAdapter;
  private _conversationState: ConversationState;
  private _userState: UserState;
  constructor() {
    const factoryOptions = {
      MicrosoftAppId: process.env.MICROSOFT_APP_ID,
      MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
      MicrosoftAppTenantId: process.env.MICROSOFT_APP_TENANT_ID,
      MicrosoftAppType: process.env.MICROSOFT_APP_TYPE,
    };
    const credentialsFactory = new ConfigurationServiceClientCredentialFactory(factoryOptions);
    const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);
    const memoryStorage = new MemoryStorage();
    this._conversationState = new ConversationState(memoryStorage);
    this._userState = new UserState(memoryStorage);
    this._cloudAdapter = new CloudAdapter(botFrameworkAuthentication);
    this._registerOnTurnError(this._cloudAdapter);
  }

  get adapter(): CloudAdapter {
    return this._cloudAdapter;
  }

  get conversationState(): ConversationState {
    return this._conversationState;
  }

  get userState(): UserState {
    return this._userState;
  }

  private _registerOnTurnError(adapter: CloudAdapter) {
    adapter.onTurnError = async (context: TurnContext, error: Error) => {
      console.log(`\n [onTurnError] unhandled error: ${error}`);
      await context.sendTraceActivity(
        "OnTurnError Trace",
        `${error}`,
        "https://www.botframework.com/schemas/error",
        "TurnError",
      );
      // Send a message to the user
      await context.sendActivity("The bot encounted an error or bug.");
      await context.sendActivity("To continue to run this bot, please fix the bot source code.");
      await this._conversationState.delete(context);
    };
  }
}
