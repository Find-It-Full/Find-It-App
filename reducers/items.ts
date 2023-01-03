import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
    foundSheet,
    itemDetails,
    messageDetails,
    userInfo,
} from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"

export interface itemState {
    items: { [itemId: string]: itemDetails }
}
const initialState: itemState = {
    items: {},
}

const chatsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        addItemToProfile(
            state,
            action: PayloadAction<{ itemId: string; data: itemDetails }>
        ) {
            state.items[action.payload.itemId] = action.payload.data
        },
        removeItemFromProfile(
            state,
            action: PayloadAction<{ itemId: string }>
        ) {
            delete state.items[action.payload.itemId]
        },
        addMessageToItem(
            state,
            action: PayloadAction<{
                itemId: string
                conversationId: string
                messageId: string
                messageDetails: messageDetails
            }>
        ) {
            state.items[action.payload.itemId].messages[
                action.payload.conversationId
            ][action.payload.messageId] = action.payload.messageDetails
        },
        removeConversationFromItem(
            state,
            action: PayloadAction<{ itemId: string; conversationId: string }>
        ) {
            delete state.items[action.payload.itemId].messages[
                action.payload.conversationId
            ]
        },
        addFoundSheetToItem(
            state,
            action: PayloadAction<{
                itemId: string
                foundSheetId: string
                foundSheetData: foundSheet
            }>
        ) {
            state.items[action.payload.itemId].foundSheets[
                action.payload.foundSheetId
            ] = action.payload.foundSheetData
        },
        removeFoundSheetFromItem(
            state,
            action: PayloadAction<{ itemId: string; foundSheetId: string }>
        ) {
            delete state.items[action.payload.itemId].messages[
                action.payload.foundSheetId
            ]
        },
    },
})

export const { addItemToProfile, removeItemFromProfile } = chatsSlice.actions
export default chatsSlice.reducer
