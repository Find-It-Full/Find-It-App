import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"

export interface Item {
    itemID: ItemID
    name: string
    icon: string
    reports: { [key: ReportID]: boolean }
    isMissing: boolean
}

export interface messageDetails {
    id: MessageID
    message: string
    timeOfSend: string
    sender: string
    conversationId: string
}

export interface conversation {
    conservationId: string
    messages: { [messageId: MessageID]: messageDetails }
}

export interface Report {
    itemID: ItemID
    fields: ReportField[]
    timeOfCreation: number
}

export enum ReportFieldType {
    EXACT_LOCATION = "EXACT_LOCATION",
    MAP_LOCATION = "MAP_LOCATION",
    MESSAGE = "MESSAGE"
}

export abstract class ReportField {

    protected _type: ReportFieldType

    constructor(type: ReportFieldType) {
        this._type = type
    }

    public get type(): ReportFieldType {
        return this._type;
    }
}

class Location extends ReportField {
    private _latitude: number
    private _longitude: number

    constructor(lat: number, lon: number, isExact: boolean) {
        super(isExact ? ReportFieldType.EXACT_LOCATION : ReportFieldType.MAP_LOCATION)
        this._latitude = lat
        this._longitude = lon
    }

    public get longitude(): number {
        return this._longitude
    }

    public get latitude(): number {
        return this._latitude
    }
 }

export class ExactLocation extends Location {
    constructor(lat: number, lon: number) {
        super(lat, lon, true)
    }
}

export class MapLocation extends Location {
    constructor(lat: number, lon: number) {
        super(lat, lon, false)
    }
}

export class Message extends ReportField {
    private _message: string

    constructor(msg: string) {
        super(ReportFieldType.MESSAGE)
        this._message = msg
    }

    public get message(): string {
        return this._message
    }
}

export interface UserProfile {
    userID: UserID
    firstName: string
    lastName: string
}

export type UserID = string
export type ItemID = string
export type ReportID = string
export type URL = string
export type MessageID = string
export type DocChanges = FirebaseFirestoreTypes.DocumentChange<FirebaseFirestoreTypes.DocumentData>[]
