import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Item, ItemID, ReportID } from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"
import { RootState } from "../store"

export interface ItemsData {
    items: { [itemID: string]: Item }
    newReports: { [itemID: ItemID]: { [reportID: ReportID]: boolean } }
}

const initialState: ItemsData = {
    items: { },
    newReports: { }
}

export const addNewItem = createAsyncThunk('items/addNewItem', async (item: Item): Promise<Item> => {
    item.icon = item.icon.trim()
    item.name = item.name.trim()
    await FirestoreBackend.addItem(item)
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

export const removeItem = createAsyncThunk('items/removeItem', async (props: string) => {
    const result = await FirestoreBackend.removeItem(props)
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
        },
        clearItems(state, _) {
            state.items = { }
        },
        addNewReport(state, action: PayloadAction<{ itemID: ItemID, reportID: ReportID }>) {
            state.newReports[action.payload.itemID] = {
                ...state.newReports[action.payload.itemID],
                [action.payload.reportID]: true
            }
        },
        removeNewReport(state, action: PayloadAction<{ itemID: ItemID, reportID: ReportID }>) {
            delete state.newReports[action.payload.itemID][action.payload.reportID]
        }
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(clearReports.rejected, (_, action) => {
                console.error(action.error)
            })
            .addCase(removeItem.rejected, (_, action) => {
                console.error(action.error)
            })
    }
})

export const { directlyAddItem, deleteItem, updateItem, clearItems, addNewReport, removeNewReport } = itemsSlice.actions
export default itemsSlice.reducer
