import { GenderTypeEnum } from "../enums/gender"

export type UserDetailsType = {
    firstName:string,
    lastName:string,
    email:string,
    gender: GenderTypeEnum,
    age:number,
    value:string
  }