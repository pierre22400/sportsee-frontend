import { Navigate, useNavigate } from "react-router";

export default function Dashboard() {
  /** Affiche le tableau de bord uniquement si la session est active. */
  const isAuthenticated =
    sessionStorage.getItem("sportsee-authenticated") === "true";
  const navigate = useNavigate();
  /** Supprime la session simulée et redirige vers la connexion. */
  function handleLogout() {
    sessionStorage.removeItem("sportsee-authenticated");
    navigate("/login", { replace: true });
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <h1>Tableau de bord</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
    </>
  );
}
