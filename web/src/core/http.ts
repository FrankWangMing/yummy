import { Axios } from "axios";
const baseURL = 'http://localhost:3000'
class Http extends Axios{

    constructor(){
        super({
            baseURL,
            params:{
                user_id:sessionStorage.getItem("user_id")
            },
            data:{
                user_id:sessionStorage.getItem("user_id")
            },
        })
        this.interceptors.response.use((r)=>{
            return JSON.parse(r.data)
        })
    }
}
export class Api {
    constructor(
        public http:Http = new Http()
    ){

    }
    createMeet(){
       return this.http.get('/meet/create')
    }
    joinMeet(meet_id:string){
        return this.http.post('/meet/join',{
            meet_id
        })
    }

}

