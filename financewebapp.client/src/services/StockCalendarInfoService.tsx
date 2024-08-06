import api from "./api";
import { StockCalendarInfoDto } from "../dtos/StockCalendarInfoDto";

export async function FetchCalendarInfo(from: string, to: string): Promise<StockCalendarInfoDto[]> {
  try {
    const response = await api.get<StockCalendarInfoDto[]>(`GetEarningsCalendar/api/earningscalendar?from=${from}&to=${to}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock price:", error);
    throw error;
  }
}