
import { useContext, useEffect, useState } from "react";

import UserAvatar from "../components/UserAvatar";
import { AuthContext } from "../context/AuthContext";
import {
  getUserInfo,
  type UserInfo,
} from "../services/sportseeApi";
import styles from "./profile.module.css";

/**
 * SPORTSEE — PAGE PROFIL CONNECTÉE À L'API REST
 *
 * Présente les informations personnelles et les
 * statistiques globales de l'utilisateur authentifié.
 *
 * Les données sont récupérées depuis GET /api/user-info.
 *
 * useEffect déclenche la requête lorsque le JWT change.
 * useState conserve les données et les états d'affichage.
 * AbortController annule une requête devenue inutile.
 *
 * Les composants, les classes CSS et les informations
 * indisponibles dans l'API sont conservés.
 *
 * Cette page reste protégée par ProtectedLayout.
 */

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const distanceFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Affiche le profil et les statistiques réelles du sportif.
 *
 * Gère les états de chargement, d'erreur et de réussite.
 * Une requête annulée ne modifie pas l'état React.
 */
export default function Profile() {
  const auth = useContext(AuthContext);

  const token = auth?.token ?? null;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Charge le profil depuis l'API à chaque changement
   * du JWT et annule l'ancienne requête si nécessaire.
   */
  useEffect(() => {
    const controller = new AbortController();

    if (!token) {
      return () => controller.abort();
    }

    async function loadProfile(): Promise<void> {
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
            "Impossible de récupérer le profil. " +
              "Vérifie que le serveur SportSee fonctionne " +
              "et que ta session est toujours valide.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => controller.abort();
  }, [token]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p role="status">
            Chargement du profil…
          </p>
        </div>
      </main>
    );
  }

  if (error || userInfo === null) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p role="alert">
            {error ?? "Aucune donnée de profil disponible."}
          </p>
        </div>
      </main>
    );
  }

  const { profile, statistics } = userInfo;

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const memberSince = dateFormatter.format(
    new Date(`${profile.createdAt}T00:00:00Z`),
  );

  const hours = Math.floor(statistics.totalDuration / 60);
  const minutes = statistics.totalDuration % 60;

  const totalDuration = `${hours} h ${minutes} min`;

  const totalDistance = distanceFormatter.format(
    Number(statistics.totalDistance),
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <section
            className={styles.leftColumn}
            aria-label="Informations personnelles"
          >
            <article className={styles.identityCard}>
              <UserAvatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                src={profile.profilePicture}
                variant="profile"
              />

              <div>
                <h1 className={styles.name}>
                  {fullName}
                </h1>

                <p className={styles.memberSince}>
                  Membre depuis le {memberSince}
                </p>
              </div>
            </article>

            <article className={styles.detailsCard}>
              <h2>Votre profil</h2>

              <dl className={styles.details}>
                <div>
                  <dt>Âge</dt>
                  <dd>{profile.age} ans</dd>
                </div>

                <div>
                  <dt>Taille</dt>
                  <dd>{profile.height} cm</dd>
                </div>

                <div>
                  <dt>Poids</dt>
                  <dd>{profile.weight} kg</dd>
                </div>
              </dl>
            </article>
          </section>

          <section
            className={styles.rightColumn}
            aria-label="Statistiques du sportif"
          >
            <header className={styles.statsHeader}>
              <h2>Vos statistiques</h2>
              <p>Depuis le {memberSince}</p>
            </header>

            <div className={styles.statsGrid}>
              <article className={styles.statCard}>
                <h3>Temps total couru</h3>
                <p>{totalDuration}</p>
              </article>

              <article className={styles.statCard}>
                <h3>Calories brûlées</h3>
                <p>Non disponible</p>
              </article>

              <article className={styles.statCard}>
                <h3>Distance totale parcourue</h3>
                <p>{totalDistance} km</p>
              </article>

              <article className={styles.statCard}>
                <h3>Nombre de jours de repos</h3>
                <p>Non disponible</p>
              </article>

              <article className={styles.statCard}>
                <h3>Nombre de sessions</h3>
                <p>{statistics.totalSessions} sessions</p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
