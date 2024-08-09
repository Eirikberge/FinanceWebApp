import { useEffect, useState } from "react";
import { AddUser } from "../services/RegisterService";
import { RegisterDto } from "../dtos/RegisterDto";

import api from "../services/api";

const Register: React.FC = () => {

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPasswordReg, setConfirmPasswordReg] = useState("");
  const [actionText, setActionText] = useState("");
  const [actionText2, setActionText2] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);




  useEffect(() => {
    if (actionText) {
      const timerId = setTimeout(() => {
        setActionText("");

      }, 5000);
      return () => clearTimeout(timerId);
    }
  }, [actionText]);

  useEffect(() => {
    if (usernameReg.trim()) {
      checkUsernameAvailability();
    }
  }, [usernameReg]);



  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUsernameAvailable) {
      setActionText("Brukernavnet er ikke tilgjengelig.");
      return;
    }

    const newUser: RegisterDto = {
      name: usernameReg,
      password: passwordReg,
    };
    if (passwordReg === confirmPasswordReg) {
      try {
        await AddUser(newUser);
        setActionText("Bruker ble registrert!");
      } catch (error) {
        setActionText("Det oppstod en feil ved registrering av bruker.");
      }
    } else {
      setActionText("Passord er ikke like")
    }
    resetInputs();
  };

  const resetInputs = () => {
    setUsernameReg("");
    setPasswordReg("");
    setConfirmPasswordReg("");
  }

  const checkUsernameAvailability = async () => {

    if (usernameReg != null) {
      try {
        const response = await api.post(`User/check/${usernameReg}`);
        if (response.data === "Username is taken.") {
          setIsUsernameAvailable(false);
          setActionText2("Brukernavn er opptatt")
        } else {
          setIsUsernameAvailable(true);
          setActionText2("")
        }
      } catch (error) {
        setIsUsernameAvailable(false);
        console.log("feil")
      }
    }
  }


  return (
    <div className="Register">
      <h1>Registrer</h1>
      <form onSubmit={addUser}>
        <label htmlFor="registerInputReg">Brukernavn:</label>
        <div>
          <input
            type="text"
            placeholder="Brukernavn"
            value={usernameReg}
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}
          />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={passwordReg}
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
          />
          <br />

          <input
            type="password"
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
      {actionText}
      {actionText2}
    </div>
  );
};

export default Register;