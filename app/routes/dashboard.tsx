import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Affiche le tableau de bord et permet la déconnexion.
 * L'accès à cette page est contrôlé par ProtectedLayout.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error("AuthProvider manquant");
  }

  /** Supprime la session simulée et redirige vers la connexion. */
  function handleLogout() {
    auth.logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <h1>Tableau de bord</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
    </>
  );
}
