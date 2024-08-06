import React, { useEffect, useState } from "react";
import { useStockContext } from "../contexts/StockProvider";
import CalendarComponent from "../components/CalendarComponent";
import Searchbar from "../components/Searchbar";
import "../styleSheets/Portfolio.css"


const Portfolio: React.FC = (): JSX.Element => {
  const { holdings, namesMap, priceMap, infoMap } = useStockContext();
  const [searchbarInput, setSearchbarInput] = useState("");
  const [filteredStockHoldings, setFilteredStockHoldings] = useState(holdings);

  useEffect(() => {
    setFilteredStockHoldings(searchItems(holdings, searchbarInput));
  }, [searchbarInput, holdings]);

  const searchItems = (stockHoldings: typeof holdings, searchbarInput: string) => {
    return stockHoldings.filter(item =>
      item.stockSymbol.toLowerCase().includes(searchbarInput.toLowerCase())
    );
  };

  const displayedStockHoldings = filteredStockHoldings.length > 0 ? filteredStockHoldings : holdings;

  const handleSearchbarChange = (value: string) => {
    setSearchbarInput(value);
  };

  const totalGain = holdings.reduce((acc, stock) => {
    const currentPrice = priceMap[stock.stockSymbol];
    if (currentPrice !== undefined) {
      acc += (currentPrice - stock.price) * stock.quantity;
    }
    return acc;
  }, 0);

  const totalWorth = holdings.reduce((acc, stock) => {
    const currentPrice = priceMap[stock.stockSymbol];
    if (currentPrice !== undefined) {
      acc += currentPrice * stock.quantity;
    }
    return acc;
  }, 0);

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

  const totalDividend = holdings.reduce((acc, stock) => {
    const stockInfo = infoMap[stock.stockSymbol];
    if (stockInfo && stockInfo.dividendPerShareAnnual !== undefined) {
      acc += stockInfo.dividendPerShareAnnual * stock.quantity;
    }
    return acc;
  }, 0);

  return (
    <div>
      <h2>Min portefølje</h2>
      <Searchbar query={searchbarInput} onSearch={handleSearchbarChange} />
      {holdings.length > 0 ? (
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
                  <td>{namesMap[stock.stockSymbol] || 'Loading...'}</td>
                  <td>{stock.price}</td>
                  <td>{priceMap[stock.stockSymbol]|| 'Loading...'}</td>
                  <td>{stock.quantity}</td>
                  <td>{infoMap[stock.stockSymbol]?.beta.toFixed(3) || 'Loading...'}</td>
                  <td>{((priceMap[stock.stockSymbol] - stock.price) * stock.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <h3>Portfolio info: </h3>
          <table className="">
            <tbody>
              <tr className="portfolioInfo">
                <th>Total worth: {totalWorth.toFixed(2)}$</th>
                <th>Total Gain: {totalGain.toFixed(2)}$</th>
                <th>Estimated annual dividend: {totalDividend.toFixed(2)}$</th>
                <th>Risk(beta): {totalBeta.toFixed(3)}</th>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading stock holdings...</p>
      )}
      <br />
      <CalendarComponent view="week" />
    </div>
  );
}

export default Portfolio;