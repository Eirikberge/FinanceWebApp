import { useEffect, useState } from "react";
import { fetchStockHoldings } from "../services/StockHoldingService";
import { fetchStockName } from "../services/StockCikAndNameService";
import { StockInfoDto } from "../dtos/StockInfoDto";
import { StockHolding } from "../dtos/StockHoldingDto";
import { fetchStockPrice } from "../services/StockPriceService";
import { FetchStockBasicData } from "../services/GetBasicFinancialDataService";
import CalendarComponent from "../components/CalendarComponent";



const Portfolio: React.FC = (): JSX.Element => {
  const [stockHoldings, setStockHoldings] = useState<StockHolding[]>([]);
  const [, setStockInfo] = useState<StockInfoDto[]>([]);
  const [stockNames, setStockNames] = useState<{ [symbol: string]: string }>({});
  const [stockPrices, setStockPrices] = useState<{ [symbol: string]: number }>({});
  const [stockBasicInfo, setStockBasicInfo] = useState<{ [symbol: string]: { beta: number; dividendPerShareAnnual: number; } }>({});
  const [totalGain, setTotalGain] = useState(0);
  const [totalWorth, setTotalWorth] = useState(0);
  const [totalBeta, setTotalBeta] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [searchbarInput, setSearchbarInput] = useState("");
  const [filteredStockHoldings, setFilteredStockHoldings] = useState<StockHolding[]>([]);


  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    setFilteredStockHoldings(searchItems(stockHoldings, searchbarInput));
  }, [searchbarInput, stockHoldings]);

  const fetchData = async () => {
    try {
      const holdings = await fetchStockHoldings();
      setStockHoldings(holdings);
      setFilteredStockHoldings(holdings);


      const stockInfoList = await fetchStockName();
      setStockInfo(stockInfoList);

      const namesMap: { [symbol: string]: string } = {};
      const priceMap: { [symbol: string]: number } = {};
      const infoMap: { [symbol: string]: { beta: number, dividendPerShareAnnual: number } } = {};

      for (const stock of holdings) {
        const foundStock = stockInfoList.find(info => info.ticker === stock.stockSymbol);
        if (foundStock) {
          namesMap[stock.stockSymbol] = foundStock.name;
        } else {
          console.log(`Stock name not found for symbol: ${stock.stockSymbol}`);
        }

        const fetchedPrice = await fetchStockPrice(stock.stockSymbol);
        if (fetchedPrice) {
          priceMap[stock.stockSymbol] = fetchedPrice.current;
        } else {
          console.log(`Stock price not found for symbol: ${stock.stockSymbol}`);
        }
        const info = await FetchStockBasicData(stock.stockSymbol);
        if (info) {
          infoMap[stock.stockSymbol] = { beta: info.beta, dividendPerShareAnnual: info.dividendPerShareAnnual };
        } else {
          console.log(`Stock price not found for symbol: ${stock.stockSymbol}`);
        }
      }

      setStockNames(namesMap);
      setStockPrices(priceMap);
      setStockBasicInfo(infoMap);

      const totalGain = holdings.reduce((acc, stock) => {
        const currentPrice = priceMap[stock.stockSymbol];
        if (currentPrice !== undefined) {
          acc += (currentPrice - stock.price) * stock.quantity;
        }
        return acc; // accumulator
      }, 0);
      setTotalGain(totalGain);

      const totalWorth = holdings.reduce((acc, stock) => {
        const currentPrice = priceMap[stock.stockSymbol];
        if (currentPrice !== undefined) {
          acc += currentPrice * stock.quantity;
        }
        return acc;
      }, 0);
      setTotalWorth(totalWorth);

      const totalBeta = holdings.reduce((acc, stock) => {
        const stockInfo = infoMap[stock.stockSymbol];
        const currentPrice = priceMap[stock.stockSymbol];
        const stockValue = currentPrice * stock.quantity;
        if (stockInfo && currentPrice !== undefined && totalWorth !== 0) {
          const weight = stockValue / totalWorth;
          acc += stockInfo.beta * weight;
        }
        return acc;
      }, 0);
      setTotalBeta(totalBeta);


      const totalDividend = holdings.reduce((acc, stock) => {
        const stockInfo = infoMap[stock.stockSymbol];
        if (stockInfo && stockInfo.dividendPerShareAnnual !== undefined) {
          acc += stockInfo.dividendPerShareAnnual * stock.quantity;
        }
        return acc;
      }, 0);
      setTotalDividend(totalDividend);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchbarChange = (value: string) => {
    setSearchbarInput(value);
  }

  const searchItems = (stockHoldings: StockHolding[], searchbarInput: string): StockHolding[] => {
    return stockHoldings.filter(item =>
      item.stockSymbol.toLowerCase().includes(searchbarInput.toLowerCase())
    );
  };

  const displayedStockHoldings = filteredStockHoldings.length > 0 ? filteredStockHoldings : stockHoldings;


  return (
    <div>
      <h2>Min portefølje</h2>
      <div className="input-wrapper">
        <input
          className="input"
          placeholder="Søk..."
          value={searchbarInput}
          onChange={(e) => handleSearchbarChange(e.target.value)}
        />
      </div>
      {stockHoldings.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Buying Price</th>
                <th>Current Price</th>
                <th>Quantity</th>
                <th>Beta</th>
                <th>Gain</th>
              </tr>
            </thead>
            <tbody>
              {displayedStockHoldings.map((stock, index) => (
                <tr key={stock.stockSymbol + '_' + index}>
                  <td>{stock.stockSymbol}</td>
                  <td>{stockNames[stock.stockSymbol] || 'Loading...'}</td>
                  <td>{stock.price}</td>
                  <td>{stockPrices[stock.stockSymbol] || 'Loading...'}</td>
                  <td>{stock.quantity}</td>
                  <td>{stockBasicInfo[stock.stockSymbol]?.beta || 'Loading...'}</td>
                  <td>{((stockPrices[stock.stockSymbol] - stock.price) * stock.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <h3>Portfolio info: </h3>
          <table className="">
            <tbody>
              <tr>
                <th>Total worth: {totalWorth.toFixed(2)}$</th>
                <th>Risk(beta): {totalBeta.toFixed(3)}</th>
                <th>Total Gain: {totalGain.toFixed(2)}$</th>
                <th>Estimated annual dividend: {totalDividend}</th>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading stock holdings...</p>
      )}
      <CalendarComponent view="week" />

    </div>
  );
}

export default Portfolio;