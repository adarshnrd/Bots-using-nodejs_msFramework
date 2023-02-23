import mongoose, {Schema,model,Document} from "mongoose";
import { GenderTypeEnum } from "../enums/gender";

export interface IUser extends Document{
    firstName:string,
    lastName:string,
    email:string,
    gender:GenderTypeEnum,
    age:number
}
// export interface IUserModel extends IUser,Document {}\
const UserSchema:Schema =new Schema({
firstName:{type:String,required:true},
lastName:{type:String,required:true},
email:{type:String,required:true},
gender:{type:String,required:true},
age:{type:Number}
})

export const UserModel= mongoose.model<IUser>('User',UserSchema)