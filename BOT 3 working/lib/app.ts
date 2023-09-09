const restify = require("restify");
const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require("botbuilder");

const MICROSOFT_APP_ID = process.env.MICROSOFT_APP_ID;
const MICROSOFT_APP_PASSWORD = process.env.MICROSOFT_APP_PASSWORD;
const PORT = process.env.PORT || 3978;

const server = restify.createServer();
server.listen(PORT, () => {
    console.log(`${server.name} listening on ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
    appId: MICROSOFT_APP_ID,
    appPassword: MICROSOFT_APP_PASSWORD,
});

const conversationState = new ConversationState(new MemoryStorage());

adapter.use(conversationState);
server.use(myMiddleware); // just for checking
function myMiddleware(req: Request, res: Response, next: Function) {
    // Your middleware logic here
    console.log('Middleware executed'); // 
    next(); // Call next to pass control to the next middleware or route handler
}

server.post("/api/message", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === "message") {
            const state = conversationState.get(context);
            await context.sendActivity(`You said ${context.activity.text}`);
        } else {
            await context.sendActivity(`${context.activity.type} event detected`);
        }
    });
});
