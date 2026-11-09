import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  /** Fournit une fonction de navigation entre les routes. */
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error("AuthProvider manquant");
  }

  const { login } = auth;

  /** Simule une connexion et ouvre le tableau de bord. */
  function handleLogin() {
    login("token-demo-sportsee");
    navigate("/dashboard");
  }

  return <button onClick={handleLogin}>Se connecter</button>;
}
