import api from "./api";
import { StockBasicData } from "../dtos/StockBasicDataDto";


  export async function FetchStockBasicData(value: string): Promise<StockBasicData> {
    try {
      const response = await api.get<StockBasicData>(`GetBasicFinancials/api/basicfinancials?symbol=${value}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching stock price:", error);
      throw error;
    }
  }
