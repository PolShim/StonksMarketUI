import { Line } from "react-chartjs-2";
import { StockDataDailyResponseDTO } from "../../StonksMarketAPI";
import { useAppSelector } from "../../app/hooks";
import {
  selectActualSelectedStockSymbol,
  selectStocksData,
} from "../stonksMarketSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

export function StocksChart() {
  const stockData = useAppSelector(selectStocksData);
  const actualSelectedSymbol = useAppSelector(selectActualSelectedStockSymbol);

  function getStockDataBySymbol(): StockDataDailyResponseDTO {
    return stockData.find((value) => {
      return value?.metaData?.symbol === actualSelectedSymbol;
    })!;
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const labels = Object.keys(getStockDataBySymbol().timeData!)
    .slice(0, 500)
    .reverse();
  console.log(labels);
  const data = Object.values(getStockDataBySymbol().timeData!)
    .slice(0, 500)
    .reverse();
  console.log(data);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Wykres akcji",
      },
    },
  };
  var chartData = {
    labels: labels,
    datasets: [
      {
        label: "Close Price",
        data: data.map((value) => value.close),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return <Line data={chartData} options={options} />;
}
