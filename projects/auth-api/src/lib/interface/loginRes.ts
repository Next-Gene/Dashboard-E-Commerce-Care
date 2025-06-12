export interface LoginRes{
    message:string,
    token:string,
    email:string
}

export interface LoginAPIRes{
    message:string,
    token:string,
        email:string,

    user:{
    _id:string,
    username:string,
    fristname:string,
    lastname:string,
    phone:string,
    role:string,
    isverified:boolean,
    createAt:string
    }
}