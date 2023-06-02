import { Col, Row } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import {
  selectStocksData,
  selectUserData,
  selectUserStocks,
  selectUserTransactions,
} from "../components/stonksMarketSlice";
import {
  AccountBalance,
  PendingActions,
  Savings,
  MonetizationOn,
} from "@mui/icons-material";
import { StockDataDailyResponseDTO, TransactionDTO } from "../StonksMarketAPI";

export function UserProfileDetails() {
  const actualUserData = useAppSelector(selectUserData);
  const stockData = useAppSelector(selectStocksData);
  const userStockData = useAppSelector(selectUserStocks);
  const userTransactions = useAppSelector(selectUserTransactions);

  function getStockDataBySymbol(
    stockSymbol: string
  ): StockDataDailyResponseDTO {
    return stockData.find((value) => {
      return value?.metaData?.symbol === stockSymbol;
    })!;
  }

  function calculateStockValue(
    stockSymbol: string,
    stockQuantity: number
  ): string {
    const stock = getStockDataBySymbol(stockSymbol);

    let value =
      stockQuantity *
      parseFloat(Object.values(stock?.timeData || {})[0]?.close!);

    return value.toFixed(2) + "$";
  }

  function getStockTransactionInfo(transaction: TransactionDTO): JSX.Element {
    let className = "";
    let operation = "";

    if (transaction.value! > 0) {
      className = "text-success";
      operation = "Kupno - ";
    } else {
      className = "text-danger";
      operation = "Sprzedaż - ";
    }

    return (
      <h4 className={className}>
        {operation +
          transaction.quantity +
          "x " +
          stockData.find(
            (stock) => stock.metaData?.symbol === transaction.stockSymbol
          )?.metaData?.name}
      </h4>
    );
  }

  return stockData ? (
    <div>
      <Row className="pt-4 pb-5 d-flex">
        <Col className="d-flex align-items-center justify-content-center">
          <AccountBalance sx={{ fontSize: 60 }} />
          <h2 className="p-2">Stan konta:</h2>
          <h3 className="p-1 mt-1">
            {actualUserData[0]?.accountBalance?.toFixed(2)}$
          </h3>
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          <Savings sx={{ fontSize: 60 }} />
          <h2 className="p-2">Posiadana ilość wszystkich akcji:</h2>
          <h3 className="p-1 mt-1">
            {userStockData.reduce(
              (acc, obj) => acc + (obj.quantity ? obj.quantity : 0),
              0
            )}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex align-items-center justify-content-center">
          <PendingActions
            sx={{ fontSize: 60, color: "#00084d" }}
          ></PendingActions>
          <h1 style={{ color: "#00084d" }}>Posiadane akcje</h1>
        </Col>
        <Col>
          <Col className="d-flex align-items-center justify-content-center">
            <MonetizationOn
              sx={{ fontSize: 60, color: "#00084d" }}
            ></MonetizationOn>
            <h1 style={{ color: "#00084d" }}>Ostatnie transakcje</h1>
          </Col>
        </Col>
      </Row>
      <Row>
        <Col>
          {userStockData.map((value) => (
            <Row className="d-flex text-center mt-3">
              <h4 className="text-primary">
                {value.quantity +
                  "x " +
                  stockData.find(
                    (stock) => stock.metaData?.symbol === value.stockSymbol
                  )?.metaData?.name}
              </h4>
              <h5 className="text-secondary">
                Wartość:{" "}
                {calculateStockValue(value.stockSymbol!, value.quantity!)}
              </h5>
            </Row>
          ))}
        </Col>
        <Col>
          {userTransactions
            .slice(-5)
            .reverse()
            .map((value) => (
              <Row className="d-flex text-center mt-3">
                {getStockTransactionInfo(value)}
                <h6 className="text-secondary">
                  Wartość: {value.value}${" | "}
                  {new Date(value.createdAt!).toLocaleString()}
                </h6>
              </Row>
            ))}
        </Col>
      </Row>
    </div>
  ) : (
    <div />
  );
}
