import api from "./api";
import { LoginUserDto } from "../dtos/LoginUserDto";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub: string;
    name: string;
    exp: number;
}

export async function LoginUserService(userLogin: LoginUserDto): Promise<DecodedToken | undefined> {
    try {
        const response = await api.post<string>("Auth/login", userLogin);
        const token = response.data;
        localStorage.setItem("token", token);

        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);  // Dekoder tokenet
            return decodedToken;
        }
    } catch (error: any) {
        throw error; 
    }

    return undefined; 
}