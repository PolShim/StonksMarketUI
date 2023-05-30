import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, StockDataDailyResponseDTO } from "../StonksMarketAPI";
import { AxiosResponse } from "axios";
import { InitUtil } from "../common/initUtil";
import { RootState } from "../app/store";

export interface IStockDataRequest {
  function: string;
  symbol: string;
  outputsize: string;
}

export interface StonksMarketState {
  stocksDataDaily: StockDataDailyResponseDTO[];
  status: "idle" | "loading" | "loaded" | "failed";
}

const initialState: StonksMarketState = {
  stocksDataDaily: [],
  status: "idle",
};

const api = new Api();
const initUtil: InitUtil = new InitUtil();

export const getStockData = createAsyncThunk(
  "stonksMarket/getStockData",
  async (request: IStockDataRequest[], { rejectWithValue }) => {
    try {
      let result: StockDataDailyResponseDTO[] = [];

      request.forEach(async (req) => {
        const response: AxiosResponse<StockDataDailyResponseDTO> =
          await api.stockData.getStockDataDailyList({
            Function: req.function,
            Symbol: req.symbol,
            OutputSize: req.outputsize,
          });
        let stockData: StockDataDailyResponseDTO = {};

        initUtil.init(stockData, response.data);
        result.push(stockData);
      });

      return result;
    } catch (err: any) {
      rejectWithValue(err.data.message);
    }
  }
);

export const stonksMarketSlice = createSlice({
  name: "stonksMarket",
  initialState,
  reducers: {},
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
      });
  },
});

export const selectStocksData = (state: RootState) =>
  state.stonksMarket.stocksDataDaily;

export default stonksMarketSlice.reducer;
