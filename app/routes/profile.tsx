
import userInfo from "../mocks/userInfo.json";
import styles from "./profile.module.css";

/**
 * SPORTSEE — PAGE PROFIL
 *
 * Présente les informations personnelles et les
 * statistiques globales de l'utilisateur.
 *
 * Les données proviennent de userInfo.json.
 * Les valeurs absentes ne sont pas inventées.
 *
 * Cette page est protégée par ProtectedLayout.
 * Elle ne modifie ni l'authentification ni les données.
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
 * Affiche les informations personnelles et
 * les statistiques générales du sportif.
 */
export default function Profile() {
  const { profile, statistics } = userInfo;

  const fullName =
    `${profile.firstName} ${profile.lastName}`;

  const initials =
    profile.firstName.charAt(0) +
    profile.lastName.charAt(0);

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
              <div
                className={styles.avatar}
                aria-hidden="true"
              >
                {initials}
              </div>

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
