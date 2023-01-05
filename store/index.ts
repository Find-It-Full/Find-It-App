import { configureStore } from "@reduxjs/toolkit"
import sessionReducer from "../reducers/session"
import itemReducer from "../reducers/items"
import userInfoReducer from "../reducers/userInfo"

const store = configureStore({
    reducer: {
        session: sessionReducer,
        items: itemReducer,
        userInfo: userInfoReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
