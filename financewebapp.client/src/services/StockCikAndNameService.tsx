import api from "./api";
import { StockInfoDto } from "../dtos/StockInfoDto";

export async function fetchStockInfo(): Promise<StockInfoDto[]> {
    try {
        const response = await api.get<StockInfoDto[]>("/CompanyInfo");
        return response.data;
    } catch (error) {
        console.error("Error fetching stock holdings:", error);
        throw error;
    }
}