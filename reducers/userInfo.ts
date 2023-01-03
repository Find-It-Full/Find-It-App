import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { itemDetails, messageDetails, userInfo } from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"

const initialState: userInfo = {
    userId: "",
    name: "",
}

export const updateUserInfo = createAsyncThunk(
    "userInfo/addItem",
    async (props: itemDetails) => {
        FirestoreBackend.addItemToFirestore(props)
    }
)

const chatsSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        changeName(state, action: PayloadAction<{ name: string }>) {
            state.name = action.payload.name
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateUserInfo.rejected, (state, action) => {
            console.error(action.error)
        })
    },
})

export const { changeName } = chatsSlice.actions
export default chatsSlice.reducer
