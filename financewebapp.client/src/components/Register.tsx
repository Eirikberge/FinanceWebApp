import { useState } from "react";
import api from "../services/api";


interface RegisterDto {
  name: string;
  password: string;
}


const Register: React.FC = () => {

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPasswordReg, setConfirmPasswordReg] = useState("");

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: RegisterDto = {
      name: usernameReg,
      password: passwordReg,
    };
    try {
      const response = await api.post<RegisterDto>("Auth/register", newUser);
      console.log("User added successfully:", response.data);
    } catch (error) {
      console.error("Error adding user:", error);
    }
    resetInputs();
  };

  const resetInputs = () => {
    setUsernameReg("");
    setPasswordReg("");
    setConfirmPasswordReg("");
  }


  return (
    <div className="Register">
      <h1>Registrer</h1>
      <form onSubmit={addUser}>
        <label htmlFor="registerInputReg">Brukernavn:</label>
        <div>
          <input
            placeholder="Email"
            value={usernameReg}
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}          />
          <br />

          <input
            placeholder="Password"
            value={passwordReg}
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
          />
          <br />

          <input
            placeholder="Repeat password"
            value={confirmPasswordReg}
            onChange={(e) => {
              setConfirmPasswordReg(e.target.value);
            }}
          />
          <br />
          <button type="submit">Registrer</button>
        </div>
      </form>
    </div>
  );
};

export default Register;