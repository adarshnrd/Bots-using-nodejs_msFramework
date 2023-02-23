import { StatePropertyAccessor, TurnContext } from "botbuilder";
import {
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  WaterfallDialog,
  WaterfallStepContext,
} from "botbuilder-dialogs";

import DIALOGS from "../constants/dialog";
import { MessageContext } from "../types/botFramework";

export default class EnglishLangDialog extends ComponentDialog {
  constructor() {
    super(DIALOGS.ENGLISH_LANG_DIALOG);
    this.addDialog(
      new WaterfallDialog(DIALOGS.WATERFALL_DIALOG, [this._initialStep.bind(this)]),
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

  private async _initialStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    await stepContext.context.sendActivity({text: 'You Choose english language'});
    return await stepContext.endDialog();
  }
}
