import UsersRepository from "../repositories/userRepository";
import { UserDetailsType } from "../types/userDetails";

export class UserService{
private _userRepository:UsersRepository;
    constructor(){
        this._userRepository=new UsersRepository();
    }

public addUser (userDetails:UserDetailsType){
this._userRepository.addUser(userDetails);
}
} 