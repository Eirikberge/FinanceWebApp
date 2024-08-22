import { createContext, useState, ReactNode, FC } from "react";

interface AuthContextType {
    auth: { isAuthenticated: boolean };
    setAuth: React.Dispatch<React.SetStateAction<{ isAuthenticated: boolean }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<{ isAuthenticated: boolean }>({ isAuthenticated: false });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;