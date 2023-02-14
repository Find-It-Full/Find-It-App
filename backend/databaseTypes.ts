import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"

export interface Item {
    itemID: ItemID
    tagID: TagID
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

export enum ReportFieldType {
    EXACT_LOCATION = "EXACT_LOCATION",
    MAP_LOCATION = "MAP_LOCATION",
    MESSAGE = "MESSAGE",
    CONTACT_INFORMATION = "CONTACT_INFORMATION",
}
export const ReportFieldTypeList = [
    "EXACT_LOCATION",
    "MAP_LOCATION",
    "MESSAGE",
    "CONTACT_INFORMATION",
]

interface ReportField {
    type: ReportFieldType
}

export interface Report {
    reportID: string
    itemID: string
    tagID: string
    fields: { [key in ReportFieldType]: ReportField }
    timeOfCreation: number
}

export function isReport(obj: any): obj is Report {
    return (
        'reportID' in obj &&
        'itemID' in obj &&
        'tagID' in obj &&
        'timeOfCreation' in obj &&
        'fields' in obj && 
        Object.entries(obj.fields).map(([type, field]) => (
            type && (field as any).type && isReportField(field) && type === field.type
        )).reduce((a, b) => a && b)
    )
}

export function isReportField(obj: any): obj is ReportField {
    if ( ! obj.type) {
        return false
    }

    const undeterminedType: string = obj.type

    const type = undeterminedType as ReportFieldType

    switch (type) {
        case ReportFieldType.EXACT_LOCATION:
            return isExactLocation(obj)
        case ReportFieldType.MAP_LOCATION:
            return isMapLocation(obj)
        case ReportFieldType.MESSAGE:
            return isMessage(obj)
        case ReportFieldType.CONTACT_INFORMATION:
            return isContactInformation(obj)
        default:
            return false
    }
}

export interface ExactLocationReportField extends ReportField {
    type: ReportFieldType.EXACT_LOCATION
    latitude: number
    longitude: number
}

export function isExactLocation(obj: any): obj is ExactLocationReportField {
    return (
        "type" in obj &&
        obj.type === ReportFieldType.EXACT_LOCATION &&
        "latitude" in obj &&
        "longitude" in obj
    )
}

export interface MapLocationReportField extends ReportField {
    type: ReportFieldType.MAP_LOCATION
    latitude: number
    longitude: number
}

export function isMapLocation(obj: any): obj is MapLocationReportField {
    return (
        "type" in obj &&
        obj.type === ReportFieldType.MAP_LOCATION &&
        "latitude" in obj &&
        "longitude" in obj
    )
}

export interface MessageReportField extends ReportField {
    type: ReportFieldType.MESSAGE
    message: string
}

export function isMessage(obj: any): obj is MessageReportField {
    return (
        "type" in obj &&
        obj.type === ReportFieldType.MESSAGE &&
        "message" in obj
    )
}

export interface ContactInformationReportField extends ReportField {
    type: ReportFieldType.CONTACT_INFORMATION
    contactInfo: string
}

export function isContactInformation(obj: any): obj is ContactInformationReportField {
    return (
        "type" in obj &&
        obj.type === ReportFieldType.CONTACT_INFORMATION &&
        "contactInfo" in obj
    )
}

export interface UserProfile {
    userID: UserID
    firstName: string
    lastName: string
    items: { [key: ItemID]: boolean }
    tags: { [key: TagID]: boolean }
}

export type UserID = string
export type ItemID = string
export type TagID = string
export type ReportID = string
export type URL = string
export type MessageID = string
export type DocChanges = FirebaseFirestoreTypes.DocumentChange<FirebaseFirestoreTypes.DocumentData>[]

export type RegisterTagResult = 'no-such-tag' | 'internal' | 'registered-to-caller' | 'registered-to-other' | 'success'

export type ChangeItemLostStateResult =
    | "no-such-item"
    | "not-authorized"
    | "unauthenticated"
    | "internal"
    | "success"