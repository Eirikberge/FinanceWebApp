import { useState } from "react";
import { LoginUserDto } from "../dtos/LoginUserDto";
import { LoginUserService } from "../services/LoginService";

const Login: React.FC = () => {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const LoginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const userLogin: LoginUserDto = {
            name: usernameInput,
            password: passwordInput,
        };
        try {
            LoginUserService(userLogin)
        } catch (error) {
            console.error("Error logging in user:", error);
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
        </div >
    );
};

export default Login;