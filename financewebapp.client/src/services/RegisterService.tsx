import api from "./api";
import { RegisterDto } from "../dtos/RegisterDto";

export async function AddUser(newUser: RegisterDto): Promise<void> {
    try {
        const response = await api.post<RegisterDto>("Auth/register", newUser);
        console.log("User added successfully:", response.data);
    } catch (error) {
        console.error("Error adding user:", error);
        throw error; 
    }
}