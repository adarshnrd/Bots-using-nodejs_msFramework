"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const dialog_1 = __importDefault(require("../constants/dialog"));
class EnglishLangDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super(dialog_1.default.ENGLISH_LANG_DIALOG);
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(dialog_1.default.WATERFALL_DIALOG, [this._initialStep.bind(this)]));
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
    async _initialStep(stepContext) {
        await stepContext.context.sendActivity({ text: 'You Choose english language' });
        return await stepContext.endDialog();
    }
}
exports.default = EnglishLangDialog;
//# sourceMappingURL=EnglishLangDialog.js.map