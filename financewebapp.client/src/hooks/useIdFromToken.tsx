import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
}

export function useIdFromToken(): number | null {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            const userId = Number(decodedToken.userId);
            return isNaN(userId) ? null : userId;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }
    return null;
}