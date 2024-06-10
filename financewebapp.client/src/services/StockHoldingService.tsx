import api from "./api";
import { StockHolding } from "../dtos/StockHoldingDto";

export async function fetchStockHoldings(): Promise<StockHolding[]> {
    try {
        const response = await api.get<StockHolding[]>("/StockHolding/1"); // "1" skal endres til userId når jeg får på plass innlogging og flere brukere
        return response.data;
    } catch (error) {
        console.error("Error fetching stock holdings:", error);
        throw error;
    }
}