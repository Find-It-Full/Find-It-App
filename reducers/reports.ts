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
        }
    }
})

export const { addReportToItem, removeReportFromItem } = reportsSlice.actions
export default reportsSlice.reducer