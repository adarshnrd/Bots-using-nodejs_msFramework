import {connect} from 'mongoose';
  
export class MongoDB{
    public static async connect(uri:string){
        try{
            await connect(uri);
        }catch(error){
            console.log(error);
        }
    }
}