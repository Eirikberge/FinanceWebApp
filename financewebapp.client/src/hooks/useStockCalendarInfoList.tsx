import { useStockContext } from "../contexts/StockProvider";

const useStockCalendarInfoList = () => {
  const { stockCalendarInfoList } = useStockContext(); 
  return stockCalendarInfoList;
};

export default useStockCalendarInfoList;