import { Button, Col, Container, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStocksData, setStockSymbolOnClick } from "../stonksMarketSlice";
import { StockDataDailyResponseDTO } from "../../StonksMarketAPI";

import "./MarketStockList.scss";
import {
  BarChart,
  East,
  Groups,
  North,
  PendingActions,
  South,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

export function MarketStockList() {
  const dispatch = useAppDispatch();
  const stockData = useAppSelector(selectStocksData);
  const navigation = useNavigate();

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
      return <North sx={{ fontSize: 30, color: "green" }} />;
    } else if (firstValue < secondValue) {
      return <South sx={{ fontSize: 30, color: "red" }} />;
    } else {
      return <East sx={{ fontSize: 30, color: "gray" }} />;
    }
  }

  async function moveToActionDetails(symbol: string) {
    await dispatch(setStockSymbolOnClick(symbol));
    navigation("/stockDetail");
    return;
  }

  return stockData ? (
    <div className="pt-2 pb-2 ps-5 pe-5">
      <Row className="p-1 align-items-center mt-5 mb-5">
        <Col className="col-4 d-flex">
          <Groups sx={{ fontSize: 40 }}></Groups>
          <h2 className="marketStockList__h2 ms-2">SPÓŁKA AKCYJNA</h2>
        </Col>
        <Col className="col-4 d-flex">
          <PendingActions sx={{ fontSize: 40 }}></PendingActions>
          <h2 className="marketStockList__h2 ms-2">SYMBOL AKCJI</h2>
        </Col>
        <Col className="col-3 d-flex">
          <BarChart sx={{ fontSize: 40 }}></BarChart>
          <h2 className="marketStockList__h2 ms-2">DANE</h2>
          <span
            className="d-flex mb-2 ps-1 align-items-end"
            style={{ fontSize: "1.1rem" }}
          >
            ({new Date().toLocaleString()})
          </span>
        </Col>
      </Row>
      {stockData ? (
        stockData.map((item: StockDataDailyResponseDTO) => (
          <Row className="p-4 align-items-center">
            <Col className="col-4">
              <h4 className="ms-3 marketStockList__h4 text-secondary">
                {item.metaData?.name}
              </h4>
            </Col>
            <Col className="col-4">
              <h5 className="ms-3 text-secondary">
                {" "}
                {item.metaData?.symbol}{" "}
                {
                  new Date(item.metaData!.lastRefreshed!.toString())
                    .toLocaleString()
                    .split(",")[0]
                }
              </h5>
            </Col>
            <Col className="col-3 d-flex">
              <Col className="col-4 d-flex justify-content-center">
                <h5 className="ms-2 text-secondary">
                  {Object.values(item.timeData || {})[0].close}$
                </h5>
              </Col>
              <Col className="col-4 d-flex justify-content-center">
                {getPercentageChange(
                  Object.values(item.timeData || {})[0].close!,
                  Object.values(item.timeData || {})[1].close!
                )}
              </Col>
              <Col className="col-4 d-flex justify-content-center">
                {getArrowPerChange(
                  Object.values(item.timeData || {})[0].close!,
                  Object.values(item.timeData || {})[1].close!
                )}
              </Col>
            </Col>
            <Col className="col-1">
              <Button
                className="btn-secondary"
                onClick={() => moveToActionDetails(item.metaData?.symbol!)}
              >
                Szczegóły
              </Button>
            </Col>
          </Row>
        ))
      ) : (
        <Row />
      )}
    </div>
  ) : (
    <div />
  );
}
