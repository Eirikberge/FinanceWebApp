import api from "./api";
import { StockHolding } from "../dtos/StockHoldingDto";
import { getUserIdFromToken } from "../components/GetUserIdFromToken";


export async function fetchStockHoldings(): Promise<StockHolding[]> {
    const userId = getUserIdFromToken();

    try {
        // const response = await api.get<StockHolding[]>(`/StockHolding/${userId}`);
        const response = await api.get<StockHolding[]>("/StockHolding/1"); // "1" skal endres til userId når jeg får på plass innlogging og flere brukere
        return response.data;
    } catch (error) {
        console.error("Error fetching stock holdings:", error);
        throw error;
    }
}