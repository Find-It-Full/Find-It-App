import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Item, ItemID } from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"

export interface ItemsData {
    items: { [itemID: string]: Item }
}

const initialState: ItemsData = {
    items: {}
}

export const addNewItem = createAsyncThunk('items/addNewItem', async (item: Item): Promise<Item> => {
    item.icon = item.icon.trim()
    item.name = item.name.trim()
    const result = await FirestoreBackend.addItem(item)

    if (result !== 'success') {
        throw new Error(result)
    }

    return item
})

export const editItemDetails = createAsyncThunk('items/editItemDetails', async (item: { name: string, icon: string, itemID: string }): Promise<void> => {
    item.icon = item.icon.trim()
    item.name = item.name.trim()
    const result = await FirestoreBackend.editItem(item)

    console.log(`Got result: ${result}`)

    if (result !== 'success') {
        throw new Error(result)
    }
})

export const setItemIsMissing = createAsyncThunk('items/setItemIsMissing', async (itemID: string) => {
    await FirestoreBackend.setItemIsMissing(itemID, true, false)
})

export const setItemIsFound = createAsyncThunk('items/setItemIsFound', async (props: { itemID: string, clearRecentReports: boolean }) => {
    await FirestoreBackend.setItemIsMissing(props.itemID, false, props.clearRecentReports)
})

export const fetchAllItems = createAsyncThunk('items/fetchAllItems', async (): Promise<Item[]> => {
    const result = await FirestoreBackend.getItems()
    return result
})

const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        directlyAddItem(state, action: PayloadAction<Item>) {
            state.items[action.payload.itemID] = action.payload
        },
        updateItem(state, action: PayloadAction<Item>) {
            state.items[action.payload.itemID] = { ...state.items[action.payload.itemID], ...action.payload }
        },
        deleteItem(state, action: PayloadAction<ItemID>) {
            delete state.items[action.payload]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewItem.fulfilled, (state, action) => {
                state.items[action.payload.itemID] = action.payload
            })
            .addCase(addNewItem.rejected, (_, action) => {
                console.error(action.error)
            })
            .addCase(fetchAllItems.fulfilled, (state, action) => {
                for (const item of action.payload) {
                    state.items[item.itemID] = item
                }
            })
            .addCase(fetchAllItems.rejected, (_, action) => {
                console.error(action.error)
            })
            .addCase(editItemDetails.rejected, (_, action) => {
                console.error(action.error)
            })
            .addCase(setItemIsFound.rejected, (_, action) => {
                console.error(action.error)
            })
            .addCase(setItemIsMissing.rejected, (_, action) => {
                console.error(action.error)
            })
    }
})

export const { directlyAddItem, deleteItem, updateItem } = itemsSlice.actions
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
