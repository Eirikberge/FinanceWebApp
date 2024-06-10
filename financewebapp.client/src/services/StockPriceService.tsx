import api from "./api";
import { Stock } from "../dtos/StockDto";


export async function fetchStockPrice(value: string): Promise<Stock> {
  try {
    const response = await api.get<Stock>(`/GetStockPrice/api/getstockprice/${value.toUpperCase()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock price:", error);
    throw error;
  }
}