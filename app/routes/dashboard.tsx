import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ActivityChart from "../components/ActivityChart";
import HeartRateChart from "../components/HeartRateChart";
import styles from "./dashboard.module.css";
import WeeklySummary from "../components/WeeklySummary";

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

const { logout } = auth;

/** Supprime la session simulée et redirige vers la connexion. */
function handleLogout() {
  logout();
  navigate("/login", { replace: true });
}
  return (
    <>
      <h1>Tableau de bord</h1>

<div className={styles.chartsGrid}>
  <ActivityChart />
  <HeartRateChart />
</div>

<div className={styles.weeklySummary}>
  <WeeklySummary />
</div>
      <button onClick={handleLogout}>Se déconnecter</button>
    </>
  );
}
