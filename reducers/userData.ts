import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemID, Report, ReportID, ReportViewStatus } from "../backend/databaseTypes";
import { FirestoreBackend } from "../backend/firestoreBackend";
import { RootState } from "../store";
import auth from "@react-native-firebase/auth"
import { clearItems, handleExternalError } from "./items";
import { removeAllReports } from "./reports";

export interface UserData {
    firstName:string,
    lastName:string,
    secondaryEmail:string
}

const initialState: UserData = {
    firstName:'',
    lastName:'',
    secondaryEmail:''
}

export const deleteUser = createAsyncThunk('userData/deleteUser', async (_props: undefined, thunkAPI) => {
    try {
        await FirestoreBackend.deleteUser()
        await auth().signOut()
        thunkAPI.dispatch(removeAllReports())
        thunkAPI.dispatch(removeUserData())
        thunkAPI.dispatch(clearItems())
    } catch (e) {
        console.error(e.message)
        thunkAPI.dispatch(handleExternalError({ message: e.message }))
    }
})

export const editAccountDetails = createAsyncThunk('userData/editAccountDetails', async (props: { firstName: string, lastName: string, secondaryEmail: string}, thunkAPI): Promise<void> => {
    const result = await FirestoreBackend.editAccount(props)
    thunkAPI.dispatch(setAccountDetails(props))
})
export const fetchAccountDetails = createAsyncThunk('userData/fetchAccountDetails', async (): Promise<UserData> => {
    const userData = await FirestoreBackend.getUserProfile()
    return userData
})



export const signOut = createAsyncThunk('userData/signOut', (_props: undefined, thunkAPI) => {
    thunkAPI.dispatch(removeAllReports())
    thunkAPI.dispatch(clearItems())
    thunkAPI.dispatch(removeUserData())
    auth().signOut()
})

const userDataSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        
        setAccountDetails(state, action: PayloadAction<UserData>) {
            
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.secondaryEmail = action.payload.secondaryEmail

        },
        removeUserData(state) {
            
            state = initialState

        }
    },
    extraReducers: (builder) => {
        builder
        
        .addCase(fetchAccountDetails.fulfilled, (state, action) => {
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.secondaryEmail = action.payload.secondaryEmail
            }
        )
        .addCase(fetchAccountDetails.pending, (state, action) => {
            
        }
    )
    .addCase(fetchAccountDetails.rejected, (state, action) => {
            
    }
)
    }
})

export const {setAccountDetails, removeUserData } = userDataSlice.actions
export default userDataSlice.reducer