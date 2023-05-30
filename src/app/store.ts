import { combineReducers } from "redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk"; // Example middleware, you can add your own
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";

import stonksMarketReducer from "../components/stonksMarketSlice";

const reducers = combineReducers({
  stonksMarket: stonksMarketReducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["stonksMarket"],
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunkMiddleware],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
