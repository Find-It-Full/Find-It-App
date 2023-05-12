import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit"
import { Item, ItemID, ReportID } from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"
import { RootState } from "../store"

export interface ItemsData {
    items: { [itemID: string]: Item }
    newReports: { [itemID: ItemID]: { [reportID: ReportID]: boolean } }
    notifyOfNoInternet: boolean
    notifyOfMiscError: boolean
}

const initialState: ItemsData = {
    items: { },
    newReports: { },
    notifyOfNoInternet: false,
    notifyOfMiscError: false
}

export const addNewItem = createAsyncThunk('items/addNewItem', async (itemInfo: { name: string, icon: string, tagID: string }): Promise<{ name: string, icon: string, tagID: string }> => {
    itemInfo.icon = itemInfo.icon.trim()
    itemInfo.name = itemInfo.name.trim()
    await FirestoreBackend.addItem(itemInfo)
    return itemInfo
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

export const clearReports = createAsyncThunk('items/clearReports', async (props: { itemID: string }, thunkAPI) => {

    const state = (thunkAPI.getState() as RootState)
    const item = state.items.items[props.itemID]
    const isMissing = item.isMissing

    await FirestoreBackend.setItemIsMissing(props.itemID, isMissing, true)
})

export const fetchAllItems = createAsyncThunk('items/fetchAllItems', async (): Promise<Item[]> => {
    const result = await FirestoreBackend.getItems()
    return result
})

export const removeItem = createAsyncThunk('items/removeItem', async (itemID: string, thunkAPI) => {
    await FirestoreBackend.removeItem(itemID)
    thunkAPI.dispatch(deleteItem(itemID))
})

function handleError(state: ItemsData, error: SerializedError) {
    if (error.message?.includes('Internet') || error.message?.includes('[firestore/unavailable]')) {
        state.notifyOfNoInternet = true
    } else {
        state.notifyOfMiscError = true
    }
}

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
        },
        clearItems(state, _action: PayloadAction<undefined>) {
            state.items = { }
            state.newReports = { }
        },
        addNewReport(state, action: PayloadAction<{ itemID: ItemID, reportID: ReportID }>) {
            state.newReports[action.payload.itemID] = {
                ...state.newReports[action.payload.itemID],
                [action.payload.reportID]: true
            }
        },
        removeNewReport(state, action: PayloadAction<{ itemID: ItemID, reportID: ReportID }>) {
            delete state.newReports[action.payload.itemID][action.payload.reportID]
        },
        resetNoInternetNotification(state, _: PayloadAction<undefined>) {
            state.notifyOfNoInternet = false
        },
        resetMiscErrorNotification(state, _: PayloadAction<undefined>) {
            state.notifyOfMiscError = false
        },
        handleExternalError(state, action: PayloadAction<SerializedError>) {
            handleError(state, action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewItem.rejected, (state, action) => {
                handleError(state, action.error)
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
            .addCase(editItemDetails.rejected, (state, action) => {
                handleError(state, action.error)
                console.error(action.error)
            })
            .addCase(setItemIsFound.rejected, (state, action) => {
                handleError(state, action.error)
                console.error(action.error)
            })
            .addCase(setItemIsMissing.rejected, (state, action) => {
                handleError(state, action.error)
                console.error(action.error)
            })
            .addCase(clearReports.rejected, (state, action) => {
                handleError(state, action.error)
                console.error(action.error)
            })
            .addCase(removeItem.rejected, (state, action) => {
                handleError(state, action.error)
                console.error(action.error)
            })
    }
})

export const { directlyAddItem, deleteItem, updateItem, clearItems, addNewReport, removeNewReport, resetNoInternetNotification, resetMiscErrorNotification, handleExternalError } = itemsSlice.actions
export default itemsSlice.reducer
