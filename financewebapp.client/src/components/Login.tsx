import { useState } from "react";
import { LoginUserDto } from "../dtos/LoginUserDto";
import { LoginUserService } from "../services/LoginService";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const Login: React.FC = () => {

    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [actionText, setActionText] = useState("");


    const LoginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const userLogin: LoginUserDto = {
            name: usernameInput,
            password: passwordInput,
        };

        try {
            const decodedToken  = await LoginUserService(userLogin);
            if (decodedToken  != undefined) {
                setAuth({ isAuthenticated: true });
                navigate(from, { replace: true });
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setActionText("Ugyldig brukernavn eller passord.");

            } else {
                setActionText("Det oppstod en feil ved innlogging av bruker.");
            }
        }

        resetInputs();
    };

    const resetInputs = () => {
        setUsernameInput("");
        setPasswordInput("");
    }

    return (
        <div className="Login">
            <h1>Logg inn</h1>
            <form onSubmit={LoginUser}>
                <label htmlFor="registerInputReg">Brukernavn:</label>
                <div>
                    <input
                        type="text"
                        placeholder="Brukernavn"
                        value={usernameInput}
                        onChange={(e) => {
                            setUsernameInput(e.target.value);
                        }}
                    />
                    <br />

                    <input
                        type="password"
                        placeholder="Passord"
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                        }}
                    />
                    <br />

                    <button type="submit">Logg inn</button>
                </div>
            </form >
            {actionText}

        </div >
    );
};

export default Login;