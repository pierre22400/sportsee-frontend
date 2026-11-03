import { useNavigate } from "react-router";

/**
 * Affiche le tableau de bord et permet la déconnexion.
 * L'accès à cette page est contrôlé par ProtectedLayout.
 */
export default function Dashboard() {
  const navigate = useNavigate();

  /** Supprime la session simulée et redirige vers la connexion. */
  function handleLogout() {
    sessionStorage.removeItem("sportsee-token");
    navigate("/login", { replace: true });
  }

  return (
    <>
      <h1>Tableau de bord</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
    </>
  );
}