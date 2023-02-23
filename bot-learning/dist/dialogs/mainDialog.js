"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const dialog_1 = __importDefault(require("../constants/dialog"));
const prompt_1 = require("../constants/prompt");
class MainDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor(dialogs) {
        super(dialog_1.default.MAIN_DIALOG);
        if (!dialogs)
            throw new Error("MainDialog.constructor: Missing parameter 'dialogs' is required");
        for (const dialog of dialogs) {
            this.addDialog(dialog);
        }
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt(prompt_1.PROMPTS.CHOICE_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(dialog_1.default.WATERFALL_DIALOG, [
            this._initialAskForLanguageStep.bind(this),
            this._languageSelectActionStep.bind(this),
        ]));
        this.initialDialogId = dialog_1.default.WATERFALL_DIALOG;
    }
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new botbuilder_dialogs_1.DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
    async _initialAskForLanguageStep(stepContext) {
        const choices = ["Add user", "Edit user", "Get user"];
        stepContext.options.choices = choices;
        // return await stepContext.beginDialog(DIALOGS.ENGLISH_LANG_DIALOG);
        return await stepContext.prompt(prompt_1.PROMPTS.CHOICE_PROMPT, {
            choices,
            style: botbuilder_dialogs_1.ListStyle.heroCard,
            prompt: 'What do you want?',
        });
    }
    async _languageSelectActionStep(stepContext) {
        const option = stepContext.context.activity.value || stepContext.context.activity.text;
        const choices = stepContext.options.choices;
        switch (option) {
            case choices[0]: {
                await stepContext.beginDialog(dialog_1.default.ADD_USER_DIALOG);
                break;
            }
            default: {
                await stepContext.context.sendActivity("Not implemented yet");
                break;
            }
        }
        return await stepContext.next();
    }
}
exports.default = MainDialog;
//# sourceMappingURL=mainDialog.js.map