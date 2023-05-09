import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemID, Report, ReportID, ReportViewStatus } from "../backend/databaseTypes";
import { FirestoreBackend } from "../backend/firestoreBackend";
import { RootState } from "../store";

export interface UserData {

}

const initialState: UserData = {

}

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