import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchStockHoldings } from '../services/StockHoldingService';
import { fetchStockInfo } from '../services/StockCikAndNameService';
import { fetchStockPrice } from '../services/StockPriceService';
import { FetchCalendarInfo } from '../services/StockCalendarInfoService';
import { fetchFinancialBasicData } from '../services/GetBasicFinancialDataService';

interface StockData {
  holdings: any[];
  stockInfoList: any[];
  stockCalendarInfoList: any[];
  namesMap: { [symbol: string]: string };
  priceMap: { [symbol: string]: number };
  infoMap: { [symbol: string]: { beta: number; dividendPerShareAnnual: number } };
  refreshData: () => Promise<void>;
}

interface StockProviderProps {
  children: ReactNode;
}

const StockContext = createContext<StockData | undefined>(undefined);

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
};

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [stockInfoList, setStockInfoList] = useState<any[]>([]);
  const [stockCalendarInfoList, setStockCalendarInfoList] = useState<any[]>([]);
  const [namesMap, setNamesMap] = useState<{ [symbol: string]: string }>({});
  const [priceMap, setPriceMap] = useState<{ [symbol: string]: number }>({});
  const [infoMap, setInfoMap] = useState<{ [symbol: string]: { beta: number; dividendPerShareAnnual: number } }>({});

  const fetchData = useCallback(async () => {

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const format = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD format


    try {
      const holdingsData = await fetchStockHoldings();
      setHoldings(holdingsData);

      const stockInfoData = await fetchStockInfo();
      setStockInfoList(stockInfoData);

      const stockCalendarInfoList = await FetchCalendarInfo(format(firstDay), format(lastDay));
      setStockCalendarInfoList(stockCalendarInfoList);

      const names: { [symbol: string]: string } = {};
      const prices: { [symbol: string]: number } = {};
      const info: { [symbol: string]: { beta: number; dividendPerShareAnnual: number } } = {};

      for (const stock of holdingsData) {
        const foundStockInfo = stockInfoData.find(info => info.ticker === stock.stockSymbol);
        if (foundStockInfo) {
          names[stock.stockSymbol] = foundStockInfo.name;
        }

        const fetchedPrice = await fetchStockPrice(stock.stockSymbol);
        if (fetchedPrice) {
          prices[stock.stockSymbol] = fetchedPrice.current;
        }

        const stockBasicData = await fetchFinancialBasicData(stock.stockSymbol);
        if (stockBasicData) {
          info[stock.stockSymbol] = { beta: stockBasicData.beta, dividendPerShareAnnual: stockBasicData.dividendPerShareAnnual };
        }
      }

      setNamesMap(names);
      setPriceMap(prices);
      setInfoMap(info);

    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contextValue: StockData = {
    holdings,
    stockInfoList,
    stockCalendarInfoList,
    namesMap,
    priceMap,
    infoMap,
    refreshData: fetchData,
  };

  return <StockContext.Provider value={contextValue}>{children}</StockContext.Provider>;
};