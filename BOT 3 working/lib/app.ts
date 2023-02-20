import { BotFrameworkAdapter,MemoryStorage,ConversationState} from "botbuilder";
import * as restify from "restify";
import {ConfState} from "./types";

let server =restify.createServer();
server.listen(process.env.port||3978,()=>{
    console.log(`${server.name} listening on ${server.url}`);
});

const adapter =new BotFrameworkAdapter({
    appId:process.env.MICROSOFT_APP_ID,
    appPassword:process.env.MICROSOFT_APP_PASSWORD
});

const conversationState =new ConversationState<ConfState>(new MemoryStorage());

adapter.use(conversationState);

server.post("/api/message",(req,res)=>{
    adapter.processActivity(req,res,async(context)=>{
        if(context.activity.type==="message"){
            const state =conversationState.get(context);
            await context.sendActivity(`you said ${context.activity.text}`);
        }else{
            await context.sendActivity(`${context.activity.type} event detected`);
        }
    });
});