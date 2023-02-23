import { UserDetailsType } from "./userDetails";

export type MessageContext = {
  choices: string[];
  userDetails:UserDetailsType;
}