import React, { useEffect, useState } from "react";
import { useStockContext } from "../contexts/StockProvider";
import CalendarComponent from "../components/CalendarComponent";
import Searchbar from "../components/Searchbar";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Min portefølje
      </Typography>
      <Searchbar query={searchbarInput} onSearch={handleSearchbarChange} />
      {holdings.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Buying Price</TableCell>
                  <TableCell>Current Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Beta</TableCell>
                  <TableCell>Gain</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedStockHoldings.map((stock, index) => (
                  <TableRow key={stock.stockSymbol + '_' + index}>
                    <TableCell>{stock.stockSymbol}</TableCell>
                    <TableCell>{namesMap[stock.stockSymbol] || 'Loading...'}</TableCell>
                    <TableCell>{stock.price}</TableCell>
                    <TableCell>{priceMap[stock.stockSymbol] || 'Loading...'}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{infoMap[stock.stockSymbol]?.beta.toFixed(3) || 'Loading...'}</TableCell>
                    <TableCell>{((priceMap[stock.stockSymbol] - stock.price) * stock.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Portfolio info:
          </Typography>
          <TableContainer component={Paper} sx={{ width: '500px' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total worth:</TableCell>
                  <TableCell>{totalWorth.toFixed(2)}$</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Gain:</TableCell>
                  <TableCell>{totalGain.toFixed(2)}$</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estimated annual dividend:</TableCell>
                  <TableCell>{totalDividend.toFixed(2)}$</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Risk (beta):</TableCell>
                  <TableCell>{totalBeta.toFixed(3)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography variant="body1">Loading stock holdings...</Typography>
      )}
      <br />
      <CalendarComponent view="week" />
    </Box>
  );
}

export default Portfolio;