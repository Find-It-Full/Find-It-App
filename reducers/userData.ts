import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemID, Report, ReportID, ReportViewStatus } from "../backend/databaseTypes";
import { FirestoreBackend } from "../backend/firestoreBackend";
import { RootState } from "../store";

export interface InAppNotificationPayload {
    itemID: ItemID
    reportID: ReportID
    itemName: string
    itemIcon: string
    timeOfCreation: number
}

export interface UserData {
    viewedReports: { [key: ReportID]: ReportViewStatus }
    reportsPendingNotification: { [key: ReportID]: InAppNotificationPayload }
    didFetchViewedReports: boolean
}

const initialState: UserData = {
    viewedReports: { },
    reportsPendingNotification: { },
    didFetchViewedReports: false
}

export const viewReport = createAsyncThunk('userData/viewReport', async (props: { reportID: ReportID }, thunkAPI) => {

    if (Object.keys((thunkAPI.getState() as RootState).userData.viewedReports).includes(props.reportID)) {
        return
    }

    await FirestoreBackend.setViewedReport(props.reportID)
})

export const notifyUserOfReport = createAsyncThunk('userData/notifyUserOfReport', async (props: { reportID: ReportID, itemID: ItemID }, thunkAPI) => {

    const state = (thunkAPI.getState() as RootState)
    const item = state.items.items[props.itemID]
    const report = state.reports[props.itemID][props.reportID]

    if (props.reportID in state.userData.reportsPendingNotification) {
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

const userDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        resetViewedReports(state, action: PayloadAction<undefined>) {
            state.didFetchViewedReports = false
        },
        setViewedReports(state, action: PayloadAction<{ [key: ReportID]: ReportViewStatus }>) {
            state.viewedReports = action.payload
            state.didFetchViewedReports = true
        },
        addInAppNotification(state, action: PayloadAction<{ payload: InAppNotificationPayload }>) {
            state.reportsPendingNotification[action.payload.payload.reportID] = action.payload.payload
        },
        setDidNotify(state, action: PayloadAction<ReportID>) {
            delete state.reportsPendingNotification[action.payload]
        }
    },
    extraReducers: (builder) => {
        builder.addCase(viewReport.rejected, () => {
            console.error('Failed to view report')
        })
    }
})

export const { setViewedReports, addInAppNotification, resetViewedReports, setDidNotify } = userDataSlice.actions
export default userDataSlice.reducer