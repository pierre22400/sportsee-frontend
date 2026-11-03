import { useNavigate } from "react-router";

export default function Login() {
  /** Fournit une fonction de navigation entre les routes. */
  const navigate = useNavigate();

  /** Simule une connexion et ouvre le tableau de bord. */
  function handleLogin() {
   sessionStorage.setItem("sportsee-token", "token-demo-sportsee");
    navigate("/dashboard");
  }

  return (
    <button onClick={handleLogin}>
      Se connecter
    </button>
  );
}