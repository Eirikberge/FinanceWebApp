import { useState, useEffect } from "react";
import { fetchStockHoldings } from "../services/StockHoldingService";
import { fetchStockPrice } from "../services/StockPriceService";
import { addTrade } from "../services/TradeService";
import { TradeDto } from "../dtos/TradeDto";
import { Stock } from "../dtos/StockDto";
import { fetchStockName } from "../services/StockCikAndNameService";
import { StockInfoDto } from "../services/StockCikAndNameService";

const Trading: React.FC = (): JSX.Element => {
  const [searchbarInputStock, setSearchbarInputStock] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Stock | null>(null);
  const [isStockOwned, setIsStockOwned] = useState(false);
  const [tradeInput, setTradeInput] = useState<number | undefined>(undefined);
  const [tradeBar, setTradeBar] = useState<"buy" | "sell" | null>(null);
  const [, setStockInfo] = useState<StockInfoDto[]>([]);
  const [stockName, setStockName] = useState<string>("");
  const [trades, setTrades] = useState<TradeDto[]>([]);
  const [,] = useState<TradeDto>({
    userId: 0,
    stockSymbol: "",
    quantity: 0,
    price: 0,
    tradeDate: new Date().toISOString(),
  });

  useEffect(() => {
    fetchData();
  }, [searchResult]);

  const fetchData = async () => {
    if (searchResult) {
      try {
        const stockInfoList = await fetchStockName();
        setStockInfo(stockInfoList);

        const foundStock = stockInfoList.find(stock => stock.ticker === searchResult.symbol);
        if (foundStock) {
          setStockName(foundStock.name);
        } else {
          console.log("Stock name not found.");
        }
      } catch (error) {
        console.error("Error getting stock info:", error);
      }
    }
  };

  const fetchStock = async (value: string) => {
    try {
      const stock = await fetchStockPrice(value);
      if (stock && stock.symbol.toUpperCase().includes(value.toUpperCase())) {
        setSearchResult(stock);
      } else {
        const stockInfoList = await fetchStockName();
        setStockInfo(stockInfoList);

        const foundStockName = stockInfoList.find(info => info.name === searchbarInputStock);
        if (foundStockName) {
          setSearchbarInputStock(foundStockName.ticker);
        }

        setSearchResult(null);
        console.error("No matching stock found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkIfStockOwned = async (symbol: string) => {
    try {
      const holdings = await fetchStockHoldings();
      return holdings.some(holding => holding.stockSymbol.toUpperCase() === symbol.toUpperCase());
    } catch (error) {
      console.error("Error fetching stock holdings:", error);
      return false;
    }
  };

  const searchButtonHandler = async (value: string) => {
    await fetchStock(value);
    const isOwned = await checkIfStockOwned(value);
    setIsStockOwned(isOwned);
  };

  const buyOrSellForm = (action: "buy" | "sell") => {
    setTradeBar(action);
  }

  const tradeStock = async () => {
    if (tradeInput === undefined) {
      console.error("Trade input is undefined");
      return;
    }

    const i = tradeBar === "sell" ? -1 : 1;

    const newTrade: TradeDto = {
      userId: 1,
      stockSymbol: searchResult?.symbol || "",
      quantity: tradeInput * i,
      price: searchResult?.current || 0,
      tradeDate: new Date().toISOString(),
    };

    try {
      await addTrade(newTrade);
      setTrades([...trades, newTrade]);
    } catch (error) {
      console.error("Error adding trade:", error);
    }
    setSearchbarInputStock("")
    setTradeBar(null)
  };

  return (
    <div className="input-wrapper">
      <input
        className="input"
        placeholder="Søk..."
        value={searchbarInputStock}
        onChange={(e) => setSearchbarInputStock(e.target.value)}
      />
      <div>
        <button onClick={() => searchButtonHandler(searchbarInputStock)}>Søk</button>
      </div>
      {searchResult ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Current Price</th>
              <th>Open Price</th>
              <th>Previous Price</th>
              <th>High</th>
              <th>Low</th>
              <th>Percent Change</th>
              <th>Change</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{stockName}</td>
              <td>{searchResult.symbol}</td>
              <td>{searchResult.current}</td>
              <td>{searchResult.open}</td>
              <td>{searchResult.previous}</td>
              <td>{searchResult.high}</td>
              <td>{searchResult.low}</td>
              <td>{searchResult.percentChange}</td>
              <td>{searchResult.change}</td>
              <td>
                <button onClick={() => buyOrSellForm('buy')}>Buy</button>
              </td>
              {isStockOwned && (
                <td>
                  <button onClick={() => buyOrSellForm('sell')}>Sell</button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      ) : (
        <p></p>
      )}
      {tradeBar === "buy" && (
        <div>
          <input
            className="input"
            placeholder="Skriv inn antall du vil kjøpe"
            value={tradeInput}
            onChange={(e) => setTradeInput(Number(e.target.value))}
          />
          <button onClick={() => tradeStock()}>Buy</button>
        </div>
      )}
      {tradeBar === "sell" && (
        <div>
          <input
            className="input"
            placeholder="Skriv inn antall du vil selge"
            value={tradeInput}
            onChange={(e) => setTradeInput(Number(e.target.value))}
          />
          <button onClick={() => tradeStock()}>Sell</button>
        </div>
      )}
    </div>
  );
};

export default Trading;