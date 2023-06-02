import { Button, Col, Form, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  buyStocks,
  getUserStockByUserName,
  getUserTransaction,
  getUsersData,
  selectActualSelectedStockSymbol,
  selectStocksData,
  selectUserData,
  selectUserStocks,
  sellStocks,
} from "../components/stonksMarketSlice";
import {
  AccountBalance,
  BarChart,
  East,
  Groups,
  North,
  PendingActions,
  Savings,
  South,
} from "@mui/icons-material";
import {
  BuySellStockRequest,
  StockDataDailyResponseDTO,
} from "../StonksMarketAPI";
import "../components/marketStocksList/MarketStockList.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { StocksChart } from "../components/stocksChart/StocksChart";
export function StockDetailsPage() {
  const actualUserData = useAppSelector(selectUserData);
  const stockData = useAppSelector(selectStocksData);
  const userStockData = useAppSelector(selectUserStocks);
  const actualSelectedSymbol = useAppSelector(selectActualSelectedStockSymbol);

  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    if (event.target.value !== "") {
      isNaN(parseInt(event.target.value))
        ? toast.error("Podaj liczbę")
        : setQuantity(parseInt(event.target.value));
    } else {
      setQuantity(0);
    }
  };

  function getStockDataBySymbol(): StockDataDailyResponseDTO {
    return stockData.find((value) => {
      return value?.metaData?.symbol === actualSelectedSymbol;
    })!;
  }

  function getPercentageChange(
    firstValue: string,
    secondValue: string
  ): JSX.Element {
    const valueChange: string = (
      parseFloat(firstValue) / parseFloat(secondValue)
    ).toFixed(2);

    var outputString = "";
    var customClassName = "";

    if (firstValue > secondValue) {
      outputString = "+" + valueChange + "%";
      customClassName =
        "marketStockList_percentage marketStockList__percentage__up";
    } else if (firstValue < secondValue) {
      outputString = "-" + valueChange + "%";
      customClassName =
        "marketStockList_percentage marketStockList__percentage__down";
    } else {
      outputString = "0,00%";
      customClassName =
        "marketStockList_percentage marketStockList__percentage__noChange";
    }

    return <h5 className={customClassName}>{outputString}</h5>;
  }
  function getArrowPerChange(
    firstValue: string,
    secondValue: string
  ): JSX.Element {
    if (firstValue > secondValue) {
      return <North sx={{ fontSize: 40, color: "green" }} />;
    } else if (firstValue < secondValue) {
      return <East sx={{ fontSize: 40, color: "red" }} />;
    } else {
      return <South sx={{ fontSize: 40, color: "gray" }} />;
    }
  }

  function getRequestToSellOrBuyStock(
    numberOfStock: number
  ): BuySellStockRequest {
    const request: BuySellStockRequest = {
      userStock: {
        stockSymbol: actualSelectedSymbol,
        quantity: numberOfStock,
        price: parseFloat(
          Object.values(getStockDataBySymbol().timeData || {})[0].close!
        ),
      },
      userName: actualUserData[0].name,
    };
    return request;
  }

  async function Buy(numberOfStock: number) {
    const reqest = getRequestToSellOrBuyStock(numberOfStock);
    const response = (await dispatch(buyStocks(reqest))).payload;

    await refreshData();
  }

  async function Sell(numberOfStock: number) {
    const reqest = getRequestToSellOrBuyStock(numberOfStock);
    const response = (await dispatch(sellStocks(reqest))).payload;

    await refreshData();
  }

  async function refreshData() {
    await dispatch(getUserStockByUserName(actualUserData[0].name!));
    await dispatch(getUsersData());
    await dispatch(getUserTransaction(actualUserData[0].name!));
  }

  return getStockDataBySymbol() ? (
    <div>
      <Row className="p-5">
        <Col className="d-flex align-items-center">
          <AccountBalance sx={{ fontSize: 60 }} />
          <h1 className="p-2">Stan konta:</h1>
          <h2 className="p-1 mt-1">
            {actualUserData[0]?.accountBalance?.toFixed(2)}$
          </h2>
        </Col>
        <Col className="d-flex align-items-center">
          <Savings sx={{ fontSize: 60 }} />
          <h1 className="p-2">Posiadana ilość akcji:</h1>
          <h2 className="p-1 mt-1">
            {userStockData?.find(
              (value) => value.stockSymbol === actualSelectedSymbol
            )?.quantity
              ? userStockData?.find(
                  (value) => value.stockSymbol === actualSelectedSymbol
                )?.quantity
              : "0"}
          </h2>
        </Col>
      </Row>
      <Row className="p-3">
        <Col>
          <Row className="justify-content-center align-items-center text-center d-flex">
            <Groups sx={{ fontSize: 100 }}></Groups>
            <h3>{getStockDataBySymbol().metaData?.name}</h3>
          </Row>
          <Row className="justify-content-center align-items-center text-center d-flex">
            <PendingActions sx={{ fontSize: 100 }}></PendingActions>
            <h3>{getStockDataBySymbol().metaData?.symbol}</h3>
          </Row>
          <Row className="justify-content-center align-items-center text-center d-flex">
            <Row className="d-flex justify-content-center">
              <BarChart sx={{ fontSize: 100 }}></BarChart>
            </Row>
            <Row className="d-flex justify-content-center">
              <Col className=" col-2 d-flex justify-content-center">
                <h5 className="ms-2 text-secondary">
                  {
                    Object.values(getStockDataBySymbol().timeData || {})[0]
                      .close
                  }
                  $
                </h5>
              </Col>
              <Col className=" col-2 justify-content-center">
                {getPercentageChange(
                  Object.values(getStockDataBySymbol().timeData || {})[0]
                    .close!,
                  Object.values(getStockDataBySymbol().timeData || {})[1].close!
                )}
              </Col>
              <Col className=" col-2 justify-content-center">
                {getArrowPerChange(
                  Object.values(getStockDataBySymbol().timeData || {})[0]
                    .close!,
                  Object.values(getStockDataBySymbol().timeData || {})[1].close!
                )}
              </Col>
            </Row>
          </Row>
        </Col>
        <Col>
          <Row className="p-5">
            <Form className="justify-content-center">
              <Form.Group className="mb-3 " controlId="formActions">
                <Form.Label>
                  <h3>Sprzedaj lub kup akcje</h3>
                </Form.Label>
                <Form.Control
                  placeholder="Podaj ilość akcji"
                  value={quantity}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center">
                <Button
                  className="m-1"
                  variant="success"
                  onClick={() => Buy(quantity)}
                >
                  <h5>Kup akcje</h5>
                </Button>
                <Button
                  className="m-1"
                  variant="danger"
                  onClick={() => Sell(quantity)}
                >
                  <h5>Sprzedaj akcje</h5>
                </Button>
              </Form.Group>
            </Form>
          </Row>
        </Col>
      </Row>
      <Row className="p-5">
        <StocksChart />
      </Row>
    </div>
  ) : (
    <div />
  );
}
