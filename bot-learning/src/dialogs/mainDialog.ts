import { StatePropertyAccessor, TurnContext } from "botbuilder";
import {
  ChoicePrompt,
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  ListStyle,
  NumberPrompt,
  TextPrompt,
  WaterfallDialog, 
  WaterfallStepContext,
} from "botbuilder-dialogs";
import DIALOGS from "../constants/dialog";

import { PROMPTS } from "../constants/prompt";
import {MessageContext } from "../types/botFramework";

export default class MainDialog extends ComponentDialog {
  
  constructor(dialogs: Array<ComponentDialog>) {
    
    super(DIALOGS.MAIN_DIALOG);
    if (!dialogs) throw new Error("MainDialog.constructor: Missing parameter 'dialogs' is required");

    for (const dialog of dialogs) {
      this.addDialog(dialog);
    }
    this.addDialog(new ChoicePrompt(PROMPTS.CHOICE_PROMPT));
    this.addDialog(
      new WaterfallDialog(DIALOGS.WATERFALL_DIALOG, [
        this._initialAskForLanguageStep.bind(this),
        this._languageSelectActionStep.bind(this),
        this._finalStep.bind(this)
      ]),
    );
    this.initialDialogId = DIALOGS.WATERFALL_DIALOG;
  }

  /**
   * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} turnContext
   * @param {*} accessor
   */
  public async run(turnContext: TurnContext, accessor: StatePropertyAccessor<DialogState>): Promise<void> {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  private async _initialAskForLanguageStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    const choices = ["Add user","Edit user","Get user"]
    stepContext.options.choices = choices;
    // return await stepContext.beginDialog(DIALOGS.ENGLISH_LANG_DIALOG);
    return await stepContext.prompt(PROMPTS.CHOICE_PROMPT, {
      choices,
      style: ListStyle.heroCard,
      prompt: 'What do you want?',
    });
  }

  private async _languageSelectActionStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    const option = stepContext.context.activity.value || stepContext.context.activity.text;
    const choices =stepContext.options.choices;
    switch(option) {
      case choices[0]: {
        return await stepContext.beginDialog(DIALOGS.ADD_USER_DIALOG);
        break;
      }
      default: {
        await stepContext.context.sendActivity("Not implemented yet");
        break;
      }
    }
    return await stepContext.next();
  }

  private async _finalStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    return await stepContext.endDialog();
  }
}