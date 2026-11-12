
import { useContext, useEffect, useState } from "react";

import ActivityChart from "../components/ActivityChart";
import HeartRateChart from "../components/HeartRateChart";
import ProfileSummary from "../components/ProfileSummary";
import WeeklySummary from "../components/WeeklySummary";

import { AuthContext } from "../context/AuthContext";

import {
  getUserInfo,
  getUserActivities,
  type Activity,
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
const [activities, setActivities] = useState<Activity[]>([]);
const [activitiesLoading, setActivitiesLoading] = useState(true);
const [activitiesError, setActivitiesError] = useState<string | null>(
  null,
);
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


/**
 * Charge les séances sportives depuis l'API.
 *
 * La période correspond à l'historique de démonstration
 * vérifié sur le backend, du 2 juin au 13 juillet 2025.
 *
 * L'annulation empêche une ancienne requête de modifier
 * l'interface après un changement de session.
 */
useEffect(() => {
  if (!token) {
    setActivities([]);
    setActivitiesLoading(false);
    return;
  }

  const controller = new AbortController();

  /**
   * Récupère les activités et actualise les états React.
   */
  async function loadActivities(): Promise<void> {
    setActivitiesLoading(true);
    setActivitiesError(null);
    setActivities([]);

    try {
      const result = await getUserActivities(
        token!,
        "2025-06-02",
        "2025-07-13",
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setActivities(result);
      }
    } catch {
      if (!controller.signal.aborted) {
        setActivitiesError(
          "Impossible de récupérer les activités sportives.",
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setActivitiesLoading(false);
      }
    }
  }

  void loadActivities();

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


{activitiesLoading ? (
  <p role="status">
    Chargement des activités sportives…
  </p>
) : activitiesError ? (
  <p role="alert">
    {activitiesError}
  </p>
) : (
  <>
    <div className={styles.chartsGrid}>
      <ActivityChart activities={activities} />
      <HeartRateChart activities={activities} />
    </div>

    <div className={styles.weeklySummary}>
      <WeeklySummary activities={activities} />
    </div>
  </>
)}


        <div className={styles.weeklySummary}>
          <WeeklySummary />
        </div>
      </div>
    </main>
  );
}
