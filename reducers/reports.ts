import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemID, Report, ReportID, ReportViewStatus, UserID } from "../backend/databaseTypes";
import { RootState } from "../store";
import { FirestoreBackend } from "../backend/firestoreBackend";
import { removeNewReport } from "./items";

export interface InAppNotificationPayload {
    itemID: ItemID
    reportID: ReportID
    itemName: string
    itemIcon: string
    timeOfCreation: number
}

export interface ReportsData {
    reports: { [key: ItemID]: { [key: ReportID]: Report } }
    reportsPendingNotification: { [key: ReportID]: InAppNotificationPayload }
}

const initialState: ReportsData = {
    reports: { },
    reportsPendingNotification: { }
}

export const viewReport = createAsyncThunk('reports/viewReport', async (props: { itemID: ItemID, reportID: ReportID, userID: UserID }, thunkAPI) => {

    console.log(`got req to view report ${props.reportID}`)

    if ((thunkAPI.getState() as RootState).reports.reports[props.itemID][props.reportID].viewStatus[props.userID] === ReportViewStatus.SEEN) {
        console.log(`report had already been seen`)
        return
    }

    console.log(`report had not been seen`)

    thunkAPI.dispatch(removeNewReport(props))

    await FirestoreBackend.setViewedReport(props.reportID)
})

export const notifyUserOfReport = createAsyncThunk('reports/notifyUserOfReport', async (props: { reportID: ReportID, itemID: ItemID }, thunkAPI) => {

    const state = (thunkAPI.getState() as RootState)
    const item = state.items.items[props.itemID]

    const reports = state.reports.reports[props.itemID]

    if ( ! reports) {
        console.error('No reports for item')
        return
    }

    const report = reports[props.reportID]

    if (props.reportID in state.reports.reportsPendingNotification) {
        console.log('Report is already pending notification, aborting')
        return
    }

    console.log('Sending notification')

    const payload: InAppNotificationPayload = {
        itemID: props.itemID,
        reportID: props.reportID,
        itemName: item.name,
        itemIcon: item.icon,
        timeOfCreation: report.timeOfCreation
    }

    await FirestoreBackend.setNotifiedOfReport(props.reportID)

    thunkAPI.dispatch(addInAppNotification({ payload: payload }))
}) 

const reportsSlice = createSlice({
    name: 'reports',
    initialState: initialState,
    reducers: {
        addReportToItem(state, action: PayloadAction<Report>) {
            state.reports[action.payload.itemID] = { 
                ...state.reports[action.payload.itemID],
                [action.payload.reportID]: action.payload
            }
        },
        removeReportFromItem(state, action: PayloadAction<Report>) {
            delete state.reports[action.payload.itemID][action.payload.reportID]
        },
        removeAllReportsFromItem(state, action: PayloadAction<ItemID>) {
            state.reports[action.payload] = { }
        },
        removeAllReports(state, _action: PayloadAction<undefined>) {
            state.reports = { }
            state.reportsPendingNotification = { }
        },
        addInAppNotification(state, action: PayloadAction<{ payload: InAppNotificationPayload }>) {
            state.reportsPendingNotification[action.payload.payload.reportID] = action.payload.payload
        },
        setDidNotify(state, action: PayloadAction<ReportID>) {
            delete state.reportsPendingNotification[action.payload]
        },
        changeReportViewStatus(state, action: PayloadAction<{ report: Report, userID: UserID }>) {
            const report = action.payload.report
            state.reports[report.itemID][report.reportID].viewStatus[action.payload.userID] = report.viewStatus[action.payload.userID]
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(viewReport.rejected, (_, action) => {
                console.error(action.error)
            })
            .addCase(notifyUserOfReport.rejected, (_, action) => {
                console.error(action.error)
            })
})

export const { addReportToItem, removeReportFromItem, removeAllReportsFromItem, addInAppNotification, setDidNotify, changeReportViewStatus, removeAllReports } = reportsSlice.actions
export default reportsSlice.reducer