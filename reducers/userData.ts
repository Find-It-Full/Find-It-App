import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemID, Report, ReportID, ReportViewStatus } from "../backend/databaseTypes";
import { FirestoreBackend } from "../backend/firestoreBackend";
import { RootState } from "../store";
import auth from "@react-native-firebase/auth"
import { clearItems, handleExternalError } from "./items";
import { removeAllReports } from "./reports";

export interface UserData {

}

const initialState: UserData = {

}

export const deleteUser = createAsyncThunk('userData/deleteUser', async (_props: undefined, thunkAPI) => {
    try {
        await FirestoreBackend.deleteUser()
        await auth().signOut()
        thunkAPI.dispatch(removeAllReports())
        thunkAPI.dispatch(clearItems())
    } catch (e) {
        console.error(e.message)
        thunkAPI.dispatch(handleExternalError({ message: e.message }))
    }
})

export const signOut = createAsyncThunk('userData/signOut', (_props: undefined, thunkAPI) => {
    thunkAPI.dispatch(removeAllReports())
    thunkAPI.dispatch(clearItems())
    auth().signOut()
})

const userDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {

    }
})

export const { } = userDataSlice.actions
export default userDataSlice.reducer