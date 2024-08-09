import api from "./api";
import { LoginUserDto } from "../dtos/LoginUserDto";
import { jwtDecode } from "jwt-decode";


export async function LoginUserService(userLogin: LoginUserDto): Promise<void> {
    try {
        const response = await api.post<string>("Auth/login", userLogin);
        const token = response.data;
        localStorage.setItem("token", token);

        if (token) {
            const decodedToken = jwtDecode(token)
            console.log("Decoded token:", decodedToken);
            console.log("User successfully logged in", token);
        }
    } catch (error) {
        console.error("Error loggin in user:", error);
        throw error;
    }
}