// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { StatusCodes } from "http-status-codes";
import { createServer, Next, plugins, Request, Response } from "restify";
import mongoose from "mongoose";

import CONSTANTS from "./constants";
import BotController from "./controllers/botController";
import { MongoDB } from "./model";
import { MONGO_DB_CONNECTION_STRING, MONGO_DB_NAME } from "./constants/mongodb";

mongoose.set("strictQuery",false);
const port = process.env.PORT || "3978";
const uri =process.env.MongoDbUri || `${MONGO_DB_CONNECTION_STRING}${MONGO_DB_NAME}`;

// Create HTTP server.
const server = createServer();

// Middleware
server.use(plugins.bodyParser());

// Bot Framework message message webhook route
const botController = new BotController();
server.opts(CONSTANTS.ROUTER_PATH.BOT_FRAMEWORK_MESSAGE_WEBHOOK, (...arg) => botController.optMessageHandler(...arg));
server.post(CONSTANTS.ROUTER_PATH.BOT_FRAMEWORK_MESSAGE_WEBHOOK, (...arg) => botController .postMessageHandler(...arg));

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
server.on("restifyError", (req: Request, res: Response, error: Error, _next: Next) => {
  return res.send(StatusCodes.INTERNAL_SERVER_ERROR);
});

//connection with mongodb
// mongoose.connect("mongodb://127.0.0.1:27017/UserData",{useNewUrlParser:true}).then(()=>{
//     console.log("Database is connected successfully")
// }).catch((err)=>{err})

(async function () {
  await MongoDB.connect(uri);  
})();


// Start server
server.listen(port, () => {
  console.log(`${server.name} listening to ${server.url}.`);
});
