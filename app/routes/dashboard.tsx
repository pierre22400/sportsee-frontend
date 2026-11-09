import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ActivityChart from "../components/ActivityChart";
import HeartRateChart from "../components/HeartRateChart";
import ProfileSummary from "../components/ProfileSummary";
import styles from "./dashboard.module.css";
import WeeklySummary from "../components/WeeklySummary";

/**
 * SPORTSEE — COMPOSITION DU TABLEAU DE BORD
 *
 * Affiche les informations du sportif et les graphiques
 * sans modifier les calculs ni les sources de données.
 * La fiche profil provient du mock userInfo.json.
 */

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
  <main className={styles.page}>
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <ProfileSummary />
      </div>

      <h1 className={styles.sectionTitle}>
        Vos dernières performances
      </h1>

      <div className={styles.chartsGrid}>
        <ActivityChart />
        <HeartRateChart />
      </div>

      <div className={styles.weeklySummary}>
        <WeeklySummary />
      </div>

      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        Se déconnecter
      </button>
    </div>
  </main>
);

}
