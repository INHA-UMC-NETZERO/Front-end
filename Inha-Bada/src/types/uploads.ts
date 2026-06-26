export type UploadsPresignedURLRequest = {
    fileName : string,
    contentType : string
}

export type UploadsPresignedURLResponse = {
    uploadUrl : string,
    key : string,
    expiresInMinutes : number
}