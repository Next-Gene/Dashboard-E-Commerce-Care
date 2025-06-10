export interface RegisterRes{
    message:string,

}

export interface RegisterAPIRes{
    message:string,
    token:string,
    user:{
    _id:string,
    username:string,
    fristname:string,
    lastname:string,
    email:string,
    phone:string,
    role:string,
    isverified:boolean,
    createAt:string
    }
}