/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BuySellStockRequest {
  userStock?: UserStockBuySellDTO;
  userName?: string | null;
}

export interface StockDataDailyResponseDTO {
  metaData?: StockDataMetaData;
  timeData?: Record<string, StockDataSampleDTO>;
}

export interface StockDataMetaData {
  information?: string | null;
  symbol?: string | null;
  /** @format date-time */
  lastRefreshed?: string;
  outputSize?: string | null;
  timeZone?: string | null;
}

export interface StockDataSampleDTO {
  open?: string | null;
  high?: string | null;
  low?: string | null;
  close?: string | null;
  the5AdjustedClose?: string | null;
  /** @format int64 */
  volume?: number;
  dividendAmount?: string | null;
  splitCoefficient?: string | null;
}

export interface TransactionDTO {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  userId?: number;
  stockSymbol?: string | null;
  /** @format int64 */
  quantity?: number;
  /** @format double */
  value?: number;
  /** @format date-time */
  createdAt?: string | null;
}

export interface UserDTO {
  /** @format int32 */
  userId?: number;
  /** @format int64 */
  accountBalance?: number;
  name?: string | null;
}

export interface UserStockBuySellDTO {
  stockSymbol?: string | null;
  /** @format int64 */
  quantity?: number;
  /** @format double */
  price?: number;
}

export interface UserStockDTO {
  /** @format int32 */
  id?: number;
  stockSymbol?: string | null;
  /** @format int64 */
  quantity?: number;
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title StonksMarket.API
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  stockData = {
    /**
     * No description
     *
     * @tags StockData
     * @name GetStockDataDailyList
     * @request GET:/StockData/GetStockDataDaily
     */
    getStockDataDailyList: (
      query?: {
        Function?: string;
        Symbol?: string;
        OutputSize?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<StockDataDailyResponseDTO, any>({
        path: `/StockData/GetStockDataDaily`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name GetAllUsersList
     * @request GET:/User/GetAllUsers
     */
    getAllUsersList: (params: RequestParams = {}) =>
      this.request<UserDTO[], any>({
        path: `/User/GetAllUsers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name AddNewUserUpdate
     * @request PUT:/User/AddNewUser
     */
    addNewUserUpdate: (
      query?: {
        userName?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<UserDTO, any>({
        path: `/User/AddNewUser`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name ResetUserUpdate
     * @request PUT:/User/ResetUser
     */
    resetUserUpdate: (
      query?: {
        userName?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<UserDTO, any>({
        path: `/User/ResetUser`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  userStock = {
    /**
     * No description
     *
     * @tags UserStock
     * @name GetUserStockByUserNameList
     * @request GET:/UserStock/GetUserStockByUserName
     */
    getUserStockByUserNameList: (
      query?: {
        userName?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<UserStockDTO[], any>({
        path: `/UserStock/GetUserStockByUserName`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserStock
     * @name BuyStockByUserCreate
     * @request POST:/UserStock/BuyStockByUser
     */
    buyStockByUserCreate: (
      data: BuySellStockRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserStockDTO, any>({
        path: `/UserStock/BuyStockByUser`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserStock
     * @name SellStockByUserCreate
     * @request POST:/UserStock/SellStockByUser
     */
    sellStockByUserCreate: (
      data: BuySellStockRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserStockDTO, any>({
        path: `/UserStock/SellStockByUser`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserStock
     * @name GetUserTransactionsByUserNameList
     * @request GET:/UserStock/GetUserTransactionsByUserName
     */
    getUserTransactionsByUserNameList: (
      query?: {
        userName?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<TransactionDTO[], any>({
        path: `/UserStock/GetUserTransactionsByUserName`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
