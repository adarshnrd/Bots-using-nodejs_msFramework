import { UserModel } from "../model/userModel";
import { UserDetailsType } from "../types/userDetails";


export default class UsersRepository{
    public async addUser(userDetails:UserDetailsType){
        const newUser =new UserModel(userDetails);
        await newUser.save();
    }
}