export interface itemAdd  {
    codeID: codeId, 
    name: string, 
    pictureURL: string
}

export interface itemDetails {
    codeID: codeId,
    name: string,
    pictureURL: url,
    messages:[],
    foundSheets:[],
    missing:boolean
}

export interface messageDetails {
    id: messageId,
    message: string,
    timeOfSend: string,
    sender:string,
    conversationId:string
}

export interface conversation{
conservationId:string,
messages:{[messageId:messageId]:messageDetails}
}

export interface foundSheet{
    itemId: itemId
    pictureURL: url,
    latitude:number,
    longitude:number,
    message:string
}


export interface userInfo{
    userId: userId,
    name:string
}

export type userId =string
export type itemId = string
export type codeId = string
export type url = string
export type messageId = string



