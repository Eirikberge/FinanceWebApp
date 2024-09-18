import React, { useEffect, useState, FormEvent } from "react";
import { useStockContext } from "../contexts/StockProvider";
import { fetchStockPrice } from "../services/StockPriceService";
import { addTrade } from "../services/TradeService";
import { TradeDto } from "../dtos/TradeDto";
import { Stock } from "../dtos/StockDto";
import Searchbar from "../components/Searchbar";
import { useIdFromToken } from "../hooks/useIdFromToken";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Alert
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Searchbar query={searchbarInput} onSearch={handleSearchbarChange} />
          <IconButton
            type="submit"
            edge="end"
            sx={{
              height: '56px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '16px',
              width: '50px'
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        {errMsg && <Alert severity="error">{errMsg}</Alert>}
      </form>
      {searchResult ? (
        <Table sx={{ width: '1000px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Open Price</TableCell>
              <TableCell>Previous Price</TableCell>
              <TableCell>High</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>Percent Change</TableCell>
              <TableCell>Change</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{stockName}</TableCell>
              <TableCell>{searchResult.symbol}</TableCell>
              <TableCell>{searchResult.current}</TableCell>
              <TableCell>{searchResult.open}</TableCell>
              <TableCell>{searchResult.previous}</TableCell>
              <TableCell>{searchResult.high}</TableCell>
              <TableCell>{searchResult.low}</TableCell>
              <TableCell>{searchResult.percentChange}</TableCell>
              <TableCell>{searchResult.change}</TableCell>
              <TableCell><Button variant="contained" onClick={() => buyOrSellForm('buy')}>Buy</Button></TableCell>

              {isStockOwned && (
                <TableCell><Button variant="outlined" onClick={() => buyOrSellForm('sell')}>Sell</Button></TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <p></p>
      )}
      {tradeBar === "buy" && (
        <Box sx={{ mt: 2, width: '300px' }}>
          <TextField
            label="Skriv inn antall du vil kjøpe"
            variant="outlined"
            value={tradeInput}
            onChange={(e) => setTradeInput(Number(e.target.value))}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={() => tradeStock()} sx={{ mt: 2 }}>
            Buy
          </Button>
        </Box>
      )}
      {tradeBar === "sell" && (
        <Box sx={{ mt: 2, width: '300px' }}>
          <TextField
            label="Skriv inn antall du vil selge"
            variant="outlined"
            value={tradeInput}
            onChange={(e) => setTradeInput(Number(e.target.value))}
            fullWidth
          />
          <Button variant="contained" color="secondary" onClick={() => tradeStock()} sx={{ mt: 2 }}>
            Sell
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Trading;