import React, { useEffect } from "react";
import logo from "./logo.svg";
import gifImage from "./Assets/stonks.gif";
import { StartPage } from "./pages/startPage";
import "./App.scss";
import { MainHeader } from "./components/header/MainHeader";
import { StockDetailsPage } from "./pages/StockDetailsPage";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router";
import {
  IStockDataRequest,
  getStockData,
  getUserStockByUserName,
  getUserTransaction,
  getUsersData,
  setStockSymbolOnClick,
} from "./components/stonksMarketSlice";
import { BrowserRouter } from "react-router-dom";
import { UserProfileDetails } from "./pages/UserProfileDetails";
function App() {
  const dispatch = useAppDispatch();
  const request: IStockDataRequest[] = [
    {
      functionType: "TIME_SERIES_DAILY_ADJUSTED",
      outputsize: "full",
      symbol: "TSCO.LON",
      name: "Tesco PLC",
    },
    {
      functionType: "TIME_SERIES_DAILY_ADJUSTED",
      outputsize: "full",
      symbol: "TSLA",
      name: "Tesla Inc",
    },
    {
      functionType: "TIME_SERIES_DAILY_ADJUSTED",
      outputsize: "full",
      symbol: "AAPL",
      name: "Apple Inc",
    },
    {
      functionType: "TIME_SERIES_DAILY_ADJUSTED",
      outputsize: "full",
      symbol: "WEN",
      name: "Wendy`s Co - Class A",
    },
    {
      functionType: "TIME_SERIES_DAILY_ADJUSTED",
      outputsize: "full",
      symbol: "MGDDF",
      name: "Michelin",
    },
  ];

  useEffect(() => {
    dispatch(getStockData(request));
    dispatch(getUsersData());
    dispatch(getUserStockByUserName("Kamil"));
    dispatch(setStockSymbolOnClick("WEN"));
    dispatch(getUserTransaction("Kamil"));
  }, []);
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <MainHeader />
        <Routes>
          <Route path="" element={<StartPage />} />
          <Route path="/stockDetail" element={<StockDetailsPage />} />
          <Route path="/userDetail" element={<UserProfileDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
