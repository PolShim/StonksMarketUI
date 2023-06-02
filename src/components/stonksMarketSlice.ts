import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Api,
  BuySellStockRequest,
  StockDataDailyResponseDTO,
  TransactionDTO,
  UserDTO,
  UserStockDTO,
} from "../StonksMarketAPI";
import { AxiosResponse } from "axios";
import { InitUtil } from "../common/initUtil";
import { RootState } from "../app/store";
import { toast } from "react-toastify";
export interface IStockDataRequest {
  functionType: string;
  symbol: string;
  outputsize: string;
  name: string;
}

export interface StonksMarketState {
  stocksDataDaily: StockDataDailyResponseDTO[];
  status: "idle" | "loading" | "loaded" | "failed";
  userStocks: UserStockDTO[];
  usersInfo: UserDTO[];
  selectedStockSymbol: string;
  userTransactions: TransactionDTO[];
}

const initialState: StonksMarketState = {
  stocksDataDaily: [],
  status: "idle",
  userStocks: [],
  usersInfo: [],
  selectedStockSymbol: "TSLA",
  userTransactions: [],
};

const api = new Api();
const initUtil: InitUtil = new InitUtil();

export const getStockData = createAsyncThunk(
  "stonksMarket/getStockData",
  async (request: IStockDataRequest[], { rejectWithValue }) => {
    try {
      const promises = request.map(async (req) => {
        const response: AxiosResponse<StockDataDailyResponseDTO> =
          await api.stockData.getStockDataDailyList({
            Function: req.functionType,
            Symbol: req.symbol,
            OutputSize: req.outputsize,
            Name: req.name,
          });
        let stockData: StockDataDailyResponseDTO = {};
        initUtil.init(stockData, response.data);
        return stockData;
      });

      const result: StockDataDailyResponseDTO[] = await Promise.all(promises);
      return result;
    } catch (err: any) {
      toast.error("Błąd ładownia danych odśwież za 60sek");
      rejectWithValue(err.data.message);
    }
  }
);

export const getUserStockByUserName = createAsyncThunk(
  "stonksMarket/getUserStockByUserName",
  async (userNameRequest: string, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<UserStockDTO[]> =
        await api.userStock.getUserStockByUserNameList({
          userName: userNameRequest,
        });

      let userStocks: UserStockDTO[] = [];
      initUtil.init(userStocks, response.data);
      return userStocks;
    } catch (err: any) {
      rejectWithValue(err.data.message);
    }
  }
);

export const getUsersData = createAsyncThunk(
  "stonksMarket/getUsersData",
  async () => {
    const response: AxiosResponse<UserDTO[]> = await api.user.getAllUsersList();

    let users: UserDTO[] = [];
    initUtil.init(users, response.data);
    return users;
  }
);

export const getUserTransaction = createAsyncThunk(
  "stonksMarket/getUserTransactions",
  async (userName: string) => {
    const response: AxiosResponse<TransactionDTO[]> =
      await api.userStock.getUserTransactionsByUserNameList({
        userName: userName,
      });

    let transactions: TransactionDTO[] = [];
    initUtil.init(transactions, response.data);
    return transactions;
  }
);

export const buyStocks = createAsyncThunk(
  "stonksMarket/buyStocks",
  async (request: BuySellStockRequest, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<UserStockDTO> =
        await api.userStock.buyStockByUserCreate(request);

      let userStock: UserStockDTO = {};
      initUtil.init(userStock, response.data);
      toast.success("Udało się wykonać transakcje");
      return userStock;
    } catch (err: any) {
      toast.error("Błąd transakcji");
      rejectWithValue(err.data.message);
    }
  }
);

export const sellStocks = createAsyncThunk(
  "stonksMarket/sellStocks",
  async (request: BuySellStockRequest, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<UserStockDTO> =
        await api.userStock.sellStockByUserCreate(request);

      let userStock: UserStockDTO = {};
      initUtil.init(userStock, response.data);
      toast.success("Udało się wykonać transakcje");
      return userStock;
    } catch (err: any) {
      toast.error("Błąd transakcji");
      rejectWithValue(err.data.message);
    }
  }
);

export const stonksMarketSlice = createSlice({
  name: "stonksMarket",
  initialState,
  reducers: {
    setStockSymbolOnClick: (state, action: PayloadAction<string>) => {
      state.selectedStockSymbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStockData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStockData.fulfilled, (state, action) => {
        state.status = "loaded";
        state.stocksDataDaily = action.payload!;
      })
      .addCase(getStockData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getUserStockByUserName.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserStockByUserName.fulfilled, (state, action) => {
        state.status = "loaded";
        state.userStocks = action.payload!;
      })
      .addCase(getUserStockByUserName.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getUsersData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsersData.fulfilled, (state, action) => {
        state.status = "loaded";
        state.usersInfo = action.payload!;
      })
      .addCase(getUsersData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(buyStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(buyStocks.fulfilled, (state, action) => {
        state.status = "loaded";
      })
      .addCase(buyStocks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(sellStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sellStocks.fulfilled, (state, action) => {
        state.status = "loaded";
      })
      .addCase(sellStocks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getUserTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserTransaction.fulfilled, (state, action) => {
        state.status = "loaded";
        state.userTransactions = action.payload;
      })
      .addCase(getUserTransaction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setStockSymbolOnClick } = stonksMarketSlice.actions;

export const selectActualSelectedStockSymbol = (state: RootState) =>
  state.stonksMarket.selectedStockSymbol;
export const selectStocksData = (state: RootState) =>
  state.stonksMarket.stocksDataDaily;
export const selectUserData = (state: RootState) =>
  state.stonksMarket.usersInfo;
export const selectUserStocks = (state: RootState) =>
  state.stonksMarket.userStocks;
export const selectStonksMarketSliceStatus = (state: RootState) =>
  state.stonksMarket.status;
export const selectUserTransactions = (state: RootState) =>
  state.stonksMarket.userTransactions;

export default stonksMarketSlice.reducer;
