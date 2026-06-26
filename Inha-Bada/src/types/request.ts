export type RequestPostRequest = {
    quantity: number;
    requestedTime : string;
};

export type RequestPostResponse = {
    id : number,
    postId : number,
    receiverId : number,
    requestedTime : string,
    quantity : number,
    status : string,
    createdAt : string
}