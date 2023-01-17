import { configureStore } from "@reduxjs/toolkit"
import sessionReducer from "../reducers/session"
import itemReducer from "../reducers/items"
import userInfoReducer from "../reducers/userInfo"
import reportsReducer from "../reducers/reports"

const store = configureStore({
    reducer: {
        session: sessionReducer,
        items: itemReducer,
        userInfo: userInfoReducer,
        reports: reportsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
