import api from "./api";
import { TradeDto } from "../dtos/TradeDto";

  export async function addTrade(addTrade: TradeDto): Promise<void> {
    try {
      const response = await api.post<TradeDto>("/Trade", addTrade);
      console.log("Trade added:", response.data);
    } catch (error) {
      console.error("Error adding trade:", error);
      throw error;
    }
  }
