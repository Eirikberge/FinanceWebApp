import { useStockContext } from "../contexts/StockProvider";

const useStockHoldings = () => {
  const { holdings } = useStockContext(); 
  return holdings;
};

export default useStockHoldings;