import React, { useEffect, useState, FormEvent } from "react";
import { useStockContext } from "../contexts/StockProvider";
import { fetchStockPrice } from "../services/StockPriceService";
import { addTrade } from "../services/TradeService";
import { TradeDto } from "../dtos/TradeDto";
import { Stock } from "../dtos/StockDto";
import Searchbar from "../components/Searchbar";
import "../styleSheets/Trading.css"
import { useIdFromToken } from "../hooks/useIdFromToken";


const Trading: React.FC = (): JSX.Element => {
  const { holdings, stockInfoList, refreshData } = useStockContext();
  const [searchbarInput, setSearchbarInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Stock | null>(null);
  const [isStockOwned, setIsStockOwned] = useState(false);
  const [tradeInput, setTradeInput] = useState<number | undefined>(0);
  const [tradeBar, setTradeBar] = useState<"buy" | "sell" | null>(null);
  const [stockName, setStockName] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
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

  useEffect(() => {
    if (errMsg) {
      const timerId = setTimeout(() => {
        setErrMsg("");
      }, 5000);
      return () => clearTimeout(timerId);
    }
  }, [errMsg]);

  const fetchData = async () => {
    if (searchResult) {
      try {
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
        const foundStockName = stockInfoList.find(info => info.name === searchbarInput);
        if (foundStockName) {
          setSearchbarInput(foundStockName.ticker);
        }
        setSearchResult(null);
        console.error("No matching stock found");
      }
    } catch (error) {
      setErrMsg(`Error fetching data with symbol ${value}`);
    }
  };

  const tradeStock = async () => {
    if (tradeInput === undefined) {
      console.error("Trade input is undefined");
      return;
    }

    const i = tradeBar === "sell" ? -1 : 1;

    const userId = useIdFromToken();
    if (userId === null) {
      return;
    }

    const newTrade: TradeDto = {
      userId: userId,
      stockSymbol: searchResult?.symbol || "",
      quantity: tradeInput * i,
      price: searchResult?.current || 0,
      tradeDate: new Date().toISOString(),
    };

    try {
      await addTrade(newTrade);
      setTrades([...trades, newTrade]);
      refreshData(); // oppdater data i StockProvider
    } catch (error) {
      console.error("Error adding trade:", error);
    }
    setSearchbarInput("")
    setTradeBar(null)
  };

  const checkIfStockOwned = async (symbol: string) => {
    try {
      return holdings.some(holding => holding.stockSymbol.toUpperCase() === symbol.toUpperCase());
    } catch (error) {
      console.error("Error fetching stock holdings:", error);
      return false;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await fetchStock(searchbarInput);
    const isOwned = await checkIfStockOwned(searchbarInput);
    setIsStockOwned(isOwned);
    setSearchbarInput("")
  };

  const buyOrSellForm = (action: "buy" | "sell") => {
    setTradeBar(action);
  }

  const handleSearchbarChange = (value: string) => {
    setSearchbarInput(value);
  };


  return (
    <div>
      <h2>Trade</h2>

      <form onSubmit={handleSubmit}>
        <div className="searchBar">
          <Searchbar query={searchbarInput} onSearch={handleSearchbarChange} />
          <button type="submit">Søk</button>
        </div>
        {errMsg}
      </form>
      {searchResult ? (
        <table className="table">
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
              <td><button onClick={() => buyOrSellForm('buy')}>Buy</button></td>

              {isStockOwned && (
                <td><button onClick={() => buyOrSellForm('sell')}>Sell</button></td>
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