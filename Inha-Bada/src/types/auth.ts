export type LoginRequest = {
    email : string,
    nickname : string,
}

export type LoginResponse = {
    token : string,
    userId : number,
    email : string,
    nickname : string,
}