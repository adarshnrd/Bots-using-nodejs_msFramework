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
  PromptValidatorContext,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext,
} from "botbuilder-dialogs";

import DIALOGS from "../constants/dialog";
import { PROMPTS } from "../constants/prompt";
import { GenderTypeEnum } from "../enums/gender";
import { UserService } from "../services/userService";
import { MessageContext } from "../types/botFramework";
import { UserDetailsType } from "../types/userDetails";

export default class AddUserDialog extends ComponentDialog {
  userservice:UserService;
  constructor() {
    super(DIALOGS.ADD_USER_DIALOG);
    this.addDialog(new TextPrompt(PROMPTS.TEXT_PROMPT));
    this.addDialog(new ChoicePrompt(PROMPTS.CHOICE_PROMPT));
    this.addDialog(new NumberPrompt(PROMPTS.NUMBER_PROMPT,this.agePromptValidator));
    this.userservice =new UserService();
    this.addDialog(
      new WaterfallDialog(DIALOGS.WATERFALL_DIALOG, [
        this._askToFirstNameStep.bind(this),
        this._askToLastNameStep.bind(this),
        this._askForEmail.bind(this),
        this._askToGenderStep.bind(this),
        this._askForAgeStep.bind(this),
        this._askAge.bind(this),
        this._finalSteps.bind(this)
      ]),);
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

  private async _askToFirstNameStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    await stepContext.context.sendActivity({ text: 'You have selected add user dialog ' });
    // return await stepContext.next();
    return await stepContext.prompt(PROMPTS.TEXT_PROMPT, {prompt: "what is your First name"});
  }

  private async _askToLastNameStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    const firstName = stepContext.context.activity.text
    stepContext.options.userDetails = {} as UserDetailsType;
    stepContext.options.userDetails.firstName=firstName
    return await stepContext.prompt(PROMPTS.TEXT_PROMPT, "what is your Last name");
  }

  private async _askForEmail(stepContext:WaterfallStepContext<MessageContext>):Promise <DialogTurnResult>{
    const lastName =stepContext.context.activity.text;
    stepContext.options.userDetails.lastName=lastName;
    await stepContext.context.sendActivity({text:`your last name is ${lastName}`})
    return await stepContext.prompt(PROMPTS.TEXT_PROMPT,"What is your Email Id");
  }

  private async _askToGenderStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    const email = stepContext.context.activity.text;
    stepContext.options.userDetails.email=email.toLocaleLowerCase();
    const choices = ["MALE", "FEMALE", "OTHER"]
    await stepContext.context.sendActivity({text:`Your Email id is ${email}`})
    return await stepContext.prompt(PROMPTS.CHOICE_PROMPT, {
      choices,
      style: ListStyle.heroCard,
      prompt: 'Select Your Gender?',
    });
  }

  private async _askForAgeStep(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    //have to ask for age
    const gender = stepContext.context.activity.text;
    stepContext.options.userDetails.gender=gender as GenderTypeEnum;
    const choices = ["Yes", "No"];
    stepContext.options.choices = choices;
    await stepContext.context.sendActivity(`You have selected ${gender}`);
    return await stepContext.prompt(PROMPTS.CHOICE_PROMPT, {
      choices,
      style: ListStyle.heroCard,
      prompt: 'Do you want to give your age',
    });
  }

  private async _askAge(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    const values = stepContext.context.activity.text;
   stepContext.options.userDetails.value=values;
    const choices = stepContext.options.choices;
    if (values === choices[0]) {
      const promptOptions = { prompt: 'Please share your age.', retryPrompt: 'The value entered must be greater than 0 and less than 150.' };
      return await stepContext.prompt(PROMPTS.NUMBER_PROMPT,promptOptions);
    }else{
      return await stepContext.next();
    }
  }

  
  private async _finalSteps(stepContext: WaterfallStepContext<MessageContext>): Promise<DialogTurnResult> {
    
    
    const text = stepContext.context.activity.text;
    const userDetails =stepContext.options.userDetails
    let description =`**User Details** - \n\n**Name**: ${userDetails.firstName} ${userDetails.lastName},\n\n**EmailId**: ${userDetails.email},\n\n**Gender**: ${userDetails.gender.toLocaleLowerCase()}`;
    if(text!=stepContext.options.choices[1])  {
      stepContext.options.userDetails.age = parseInt(text);
      description =`${description}, \n\nAge: **${text}** `
    }
    await stepContext.context.sendActivity(description);
    await this.userservice.addUser(userDetails);
    return await stepContext.endDialog();
  }
 
  private async agePromptValidator(promptContext: PromptValidatorContext<number>) {
    return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 150;
}
}
