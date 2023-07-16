/////////////////////////
// DATABASE INTERFACES //
/////////////////////////

export interface Item {
    itemID: string
    tagID: string
    name: string
    icon: string
    emailNotifications: string
    pushNotifications: string
    reports: { [key: string]: boolean }
    isMissing: boolean,
    ownerID: string,
    dateAdded: number
}

export interface Report {
    reportID: string
    itemID: string
    tagID: string
    fields: { [key in ReportFieldType]: ReportField }
    timeOfCreation: number
    viewStatus: { [key: UserID]: ReportViewStatus }
}

export interface UserData {
    firstName: string
    lastName: string
    secondaryEmail: string
}

export interface UserData {
    items: { [key: ItemID]: boolean }
    notificationTokens: string[]
    viewedReports: { [key: ReportID]: ReportViewStatus }
    userID: string
}

export interface Link {
    tagID: TagID
    linkID: string
}

export interface Tag {
    tagID: string
    isAssociatedWithItem: boolean
    associatedItemID: string | null
}

/////////////////////////////
// REPORT FIELD INTERFACES //
/////////////////////////////

export interface ReportField {
    type: ReportFieldType
}

export interface ExactLocationReportField extends ReportField {
    type: ReportFieldType.EXACT_LOCATION
    latitude: number
    longitude: number
}

export interface MapLocationReportField extends ReportField {
    type: ReportFieldType.MAP_LOCATION
    latitude: number
    longitude: number
}

export interface MessageReportField extends ReportField {
    type: ReportFieldType.MESSAGE
    message: string
}

export interface ContactInformationReportField extends ReportField {
    type: ReportFieldType.CONTACT_INFORMATION
    contactInfo: number
}

//////////////////////////
// REPORT FIELD CLASSES //
//////////////////////////

export abstract class ReportFieldBase {
    protected _type: ReportFieldType

    constructor(type: ReportFieldType) {
        this._type = type
    }

    public get type(): ReportFieldType {
        return this._type
    }

    public abstract toPlainObject(): any
}

class Location extends ReportFieldBase {
    private _latitude: number
    private _longitude: number

    constructor(lat: number, lng: number, isExact: boolean) {
        super(
            isExact
                ? ReportFieldType.EXACT_LOCATION
                : ReportFieldType.MAP_LOCATION
        )
        this._latitude = lat
        this._longitude = lng
    }

    public get longitude(): number {
        return this._longitude
    }

    public get latitude(): number {
        return this._latitude
    }
    public toPlainObject(): any {
        return {
            type: ReportFieldType.EXACT_LOCATION,
            latitude: this.latitude,
            longitude: this.longitude,
        }
    }
}

export class ExactLocation extends Location {
    constructor(lat: number, lng: number) {
        super(lat, lng, true)
    }
}

export class MapLocation extends Location {
    constructor(lat: number, lng: number) {
        super(lat, lng, false)
    }
}

export class Message extends ReportFieldBase {
    private message: string

    toPlainObject() {
        return {
            type: ReportFieldType.MESSAGE,
            message: this.message,
        }
    }

    constructor(msg: string) {
        super(ReportFieldType.MESSAGE)
        this.message = msg
    }

    public get _message(): string {
        return this.message
    }
}

export class ContactInformation extends ReportFieldBase {
    private contactInfo: number

    toPlainObject() {
        return {
            type: ReportFieldType.CONTACT_INFORMATION,
            contactInfo: this.contactInfo,
        }
    }

    constructor(contactInfo: number) {
        super(ReportFieldType.CONTACT_INFORMATION)
        this.contactInfo = contactInfo
    }

    public get message(): number {
        return this.contactInfo
    }
}

///////////////////
// TYPE CHECKERS //
///////////////////

export function isReport(obj: any): obj is Report {
    return (
        obj != null &&
        typeof obj == 'object' && 
        'reportID' in obj &&
        'itemID' in obj &&
        'tagID' in obj &&
        'timeOfCreation' in obj &&
        'fields' in obj && 
        'viewStatus' in obj &&
        Object.entries(obj.viewStatus).map(([id, status]) => (
            typeof id === 'string' && ReportViewStatusValues.includes(status as any)
        )).reduce((a, b) => a && b) &&
        Object.entries(obj.fields).map(([type, field]) => (
            type && (field as any).type && isReportField(field) && type === field.type
        )).reduce((a, b) => a && b)
    )
}

export function isReportField(obj: any): obj is ReportField {

    if (obj == null || typeof obj != 'object') {
        return false
    }

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

export function isExactLocation(obj: any): obj is ExactLocationReportField {
    return (
        obj != null &&
        typeof obj == 'object' && 
        'type' in obj &&
        obj.type === ReportFieldType.EXACT_LOCATION &&
        'latitude' in obj &&
        'longitude' in obj &&
        typeof obj.latitude === 'number' &&
        typeof obj.longitude === 'number'
    )
}

export function isMapLocation(obj: any): obj is MapLocationReportField {
    return (
        obj != null &&
        typeof obj == 'object' && 
        'type' in obj &&
        obj.type === ReportFieldType.MAP_LOCATION &&
        'latitude' in obj &&
        'longitude' in obj &&
        typeof obj.latitude === 'number' &&
        typeof obj.longitude === 'number'
    )
}

export function isMessage(obj: any): obj is MessageReportField {
    return (
        obj != null &&
        typeof obj == 'object' && 
        'type' in obj &&
        obj.type === ReportFieldType.MESSAGE &&
        'message' in obj &&
        typeof obj.message === 'string'
    )
}

export function isContactInformation(obj: any): obj is ContactInformationReportField {
    return (
        obj != null &&
        typeof obj == 'object' && 
        'type' in obj &&
        obj.type === ReportFieldType.CONTACT_INFORMATION &&
        'contactInfo' in obj &&
        Number.isInteger(obj.contactInfo) &&
        obj.contactInfo.toString().length === 10
    )
}

function isFirestoreSet(obj: any, valueType: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' = 'boolean'): boolean {

    if (typeof obj !== 'object') {
        return false
    }

    for (const item of Object.entries(obj)) {

        if (typeof item[0] !== 'string') {
            return false
        }

        if (item[0].length !== 20) {
            return false
        }

        if (typeof item[1] !== valueType) {
            return false
        }
    }

    return true
}

export function isUserData(obj: any): obj is UserData {
    if (obj == undefined) {
        return false
    }

    let containsAtLeastOneKey = false

    for (const [key, type] of [['items', 'boolean'], ['tags', 'boolean'], ['viewedReports', 'string']]) {
        if (key in obj) {
            if ( ! isFirestoreSet(obj[key], type as 'boolean' | 'string')) {
                console.log(`invalid firestore set ${key}`)
                return false
            }

            containsAtLeastOneKey = true
        }
    }

    if ('viewedReports' in obj) {
        for (const viewState of Object.values(obj['viewedReports'])) {
            if ( ! ReportViewStatusValues.includes(viewState as any)) {
                return false
            }
        }
    }

    if ('notificationTokens' in obj) {
        if ( ! Array.isArray(obj['notificationTokens'])) {
            return false
        }

        for (const token of obj['notificationTokens']) {
            if (typeof token !== 'string') {
                return false
            }
        }

        containsAtLeastOneKey = true
    }

    if ( ! containsAtLeastOneKey && Object.keys(obj).length > 0) {
        return false
    }

    return true
}

/////////////////////
// ENUMS AND TYPES //
/////////////////////

export enum Collections {
    Items = 'items',
    Tags = 'tags',
    Reports = 'reports',
    Users = 'users',
    Links = 'links',
    ReportableTagIDs = 'reportableTagIDs'
}

export type UserID = string
export type ItemID = string
export type TagID = string
export type ReportID = string
export type URL = string
export type MessageID = string

export type RegisterTagResult = 'no-such-tag' | 'internal' | 'registered-to-caller' | 'registered-to-other' | 'success'

export enum ReportViewStatus {
    UNSEEN = 'unseen',
    NOTIFIED = 'notified',
    SEEN = 'seen'
}

const ReportViewStatusValues = [
    ReportViewStatus.UNSEEN, 
    ReportViewStatus.NOTIFIED, 
    ReportViewStatus.SEEN
]

export enum ReportFieldType {
    EXACT_LOCATION = 'EXACT_LOCATION',
    MAP_LOCATION = 'MAP_LOCATION',
    MESSAGE = 'MESSAGE',
    CONTACT_INFORMATION = 'CONTACT_INFORMATION',
}

export const ReportFieldTypeList = [
    'EXACT_LOCATION',
    'MAP_LOCATION',
    'MESSAGE',
    'CONTACT_INFORMATION',
]