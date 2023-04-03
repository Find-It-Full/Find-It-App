import { configureStore } from "@reduxjs/toolkit"
import itemReducer from "../reducers/items"
import reportsReducer from "../reducers/reports"
import userDataReducer from "../reducers/userData"

const store = configureStore({
    reducer: {
        items: itemReducer,
        reports: reportsReducer,
        userData: userDataReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
