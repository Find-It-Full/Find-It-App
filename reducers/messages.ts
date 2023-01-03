import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { itemDetails, messageDetails, userInfo } from "../backend/databaseTypes"
import { FirestoreBackend } from "../backend/firestoreBackend"

export interface convoState {
    conversations: { [conservationId: string]: { [messageId: string]:messageDetails } }
}
const initialState: convoState = {
    conversations: {}
}



const chatsSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
    addOutgoingMessage(state, action: PayloadAction<{conversationId:string, messageId: string, data: messageDetails }>) {
            state.conversations[action.payload.conversationId].messages[action.payload.messageId] = action.payload.data
    },
        removeConversation(state, action: PayloadAction<{ conversationId: string }>) {
           delete state.conversations[action.payload.conversationId]
        },
   
    }
})

export const { addOutgoingMessage } = chatsSlice.actions
export default chatsSlice.reducer