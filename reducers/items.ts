import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Item } from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"

export interface ItemsData {
    items: { [itemID: string]: Item }
}

const initialState: ItemsData = {
    items: {}
}

export const addNewItem = createAsyncThunk('items/addNewItem', async (item: Item): Promise<Item> => {
    await FirestoreBackend.addItem(item)
    return item
})

const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewItem.fulfilled, (state, action) => {
                state.items[action.payload.itemID] = action.payload
            })
    }
})

export const { } = itemsSlice.actions
export default itemsSlice.reducer

/*
        removeItemFromProfile(
            state,
            action: PayloadAction<{ itemId: string }>
        ) {
            delete state.items[action.payload.itemId]
        }

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

*/
