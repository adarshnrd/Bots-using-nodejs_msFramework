"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const dialog_1 = __importDefault(require("../constants/dialog"));
const prompt_1 = require("../constants/prompt");
class AddUserDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super(dialog_1.default.ADD_USER_DIALOG);
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(prompt_1.PROMPTS.FIRSTNAME));
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(prompt_1.PROMPTS.LASTNAME));
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt(prompt_1.PROMPTS.GENDER));
        this.addDialog(new botbuilder_dialogs_1.NumberPrompt(prompt_1.PROMPTS.AGE));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(dialog_1.default.WATERFALL_DIALOG, [this._askToFirstNameStep.bind(this), this._askToLastNameStep.bind(this), this._askToGenderStep.bind(this), this._askForAgeStep.bind(this), this._finalStep.bind(this)
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
    async _askToFirstNameStep(stepContext) {
        await stepContext.context.sendActivity({ text: 'You have selected add user dialog ' });
        return await stepContext.prompt(prompt_1.PROMPTS.FIRSTNAME, "what is your First name");
    }
    async _askToLastNameStep(stepContext) {
        const firstName = stepContext.context.activity.text;
        await stepContext.context.sendActivity({ text: `You First Name is ${firstName}` });
        return await stepContext.prompt(prompt_1.PROMPTS.LASTNAME, "what is your Last name");
    }
    async _askToGenderStep(stepContext) {
        const lastName = stepContext.context.activity.text;
        const choices = ["MALE", "FEMALE", "OTHER"];
        stepContext.options.choices = choices;
        await stepContext.context.sendActivity({ text: `Your lastName is ${lastName}` });
        return await stepContext.prompt(prompt_1.PROMPTS.GENDER, {
            choices,
            style: botbuilder_dialogs_1.ListStyle.heroCard,
            prompt: 'Select Your Gender?',
        });
    }
    async _askForAgeStep(stepContext) {
        //have to ask for age
        const gender = stepContext.context.activity.value;
        const choices = ["Yes", "No"];
        stepContext.options.choices = choices;
        await stepContext.context.sendActivity({ value: `You have selected ${gender}` });
        return await stepContext.prompt(prompt_1.PROMPTS.GENDER, {
            choices,
            style: botbuilder_dialogs_1.ListStyle.heroCard,
            prompt: 'Do you want to give your age',
        });
    }
    async _finalStep(stepContext) {
        const values = stepContext.context.activity.value;
        if (values === "Yes") {
            return await stepContext.prompt(prompt_1.PROMPTS.AGE, `Your age is ${stepContext.context.activity.text} `);
        }
        return await stepContext.endDialog();
    }
}
exports.default = AddUserDialog;
//# sourceMappingURL=addUserDialog.js.map