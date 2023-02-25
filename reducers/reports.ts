import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemID, Report, ReportID } from "../backend/databaseTypes";

export interface ReportsData {
    [key: ItemID]: { [key: ReportID]: Report }
}

const initialState: ReportsData = { }

export const fetchReportsForItemID = createAsyncThunk('reports/fetchReportsForItemID', async (itemID: ItemID) => {

})

const reportsSlice = createSlice({
    name: 'reports',
    initialState: initialState,
    reducers: {
        addReportToItem(state, action: PayloadAction<Report>) {
            state[action.payload.itemID] = { 
                ...state[action.payload.itemID],
                [action.payload.reportID]: action.payload
            }
        },
        removeReportFromItem(state, action: PayloadAction<Report>) {
            delete state[action.payload.itemID][action.payload.reportID]
        },
        removeAllReportsFromItem(state, action: PayloadAction<ItemID>) {
            state[action.payload] = { }
        }
    }
})

export const { addReportToItem, removeReportFromItem, removeAllReportsFromItem } = reportsSlice.actions
export default reportsSlice.reducer