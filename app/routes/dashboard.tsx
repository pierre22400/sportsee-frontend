
import { useContext, useEffect, useState } from "react";

import ActivityChart from "../components/ActivityChart";
import HeartRateChart from "../components/HeartRateChart";
import ProfileSummary from "../components/ProfileSummary";
import WeeklySummary from "../components/WeeklySummary";

import { AuthContext } from "../context/AuthContext";

import {
  getUserInfo,
  type UserInfo,
} from "../services/sportseeApi";

import styles from "./dashboard.module.css";

/**
 * SPORTSEE — COMPOSITION DU TABLEAU DE BORD
 *
 * Le Dashboard récupère le profil depuis l'API REST
 * et le transmet à ProfileSummary par une prop.
 *
 * Les graphiques ActivityChart, HeartRateChart et
 * WeeklySummary restent inchangés à cette étape.
 *
 * La gestion du chargement et des erreurs est limitée
 * à la fiche Profil pour préserver les graphiques.
 *
 * Une requête en cours est annulée lorsque le composant
 * est démonté ou que le JWT change.
 */

/**
 * Affiche le Dashboard et charge les informations
 * de l'utilisateur authentifié depuis le backend.
 */
export default function Dashboard() {
  const auth = useContext(AuthContext);
  const token = auth?.token ?? null;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les informations du profil depuis l'API.
   * Annule la requête lorsqu'elle n'est plus utile.
   */
  useEffect(() => {
    if (!token) {
      setUserInfo(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    /**
     * Effectue le chargement asynchrone du profil.
     */
    async function loadUserInfo(): Promise<void> {
      setIsLoading(true);
      setError(null);
      setUserInfo(null);

      try {
        const result = await getUserInfo(
          token!,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setUserInfo(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(
            "Impossible de récupérer les informations du profil.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadUserInfo();

    return () => controller.abort();
  }, [token]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.profileSection}>
          {isLoading ? (
            <p role="status">
              Chargement du profil…
            </p>
          ) : error ? (
            <p role="alert">
              {error}
            </p>
          ) : userInfo ? (
            <ProfileSummary userInfo={userInfo} />
          ) : (
            <p role="status">
              Aucun profil disponible.
            </p>
          )}
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
      </div>
    </main>
  );
}
