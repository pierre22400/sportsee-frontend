import userInfo from "../mocks/userInfo.json";
import styles from "./ProfileSummary.module.css";
import UserAvatar from "./UserAvatar";

/**
 * SPORTSEE — FICHE PROFIL DU TABLEAU DE BORD
 *
 * Présente le profil et la distance cumulée à partir
 * du mock utilisateur, sans modifier ses données.
 * Affiche les initiales si la photo du backend local
 * n'est pas disponible.
 *
 * Ce composant est purement présentatif : il ne change
 * ni la session, ni les routes, ni les graphiques.
 */

const distanceFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Affiche la carte profil et assure un repli visuel
 * si l'image du service de démonstration est indisponible.
 */
export default function ProfileSummary() {
  const { profile, statistics } = userInfo;

  const fullName = `${profile.firstName} ${profile.lastName}`;
 
  const memberSince = dateFormatter.format(
    new Date(`${profile.createdAt}T00:00:00Z`),
  );
  const totalDistance = Number(statistics.totalDistance);
  const distanceLabel = Number.isFinite(totalDistance)
    ? distanceFormatter.format(totalDistance)
    : "—";

  return (
    <section className={styles.card} aria-label="Résumé du profil sportif">
      <UserAvatar
        firstName={profile.firstName}
        lastName={profile.lastName}
        src={profile.profilePicture}
        variant="dashboard"
      />

      <div className={styles.identity}>
        <h2 className={styles.name}>{fullName}</h2>
        <p className={styles.memberSince}>Membre depuis le {memberSince}</p>
      </div>

      <div className={styles.distance}>
        <span className={styles.distanceLabel}>Distance totale parcourue</span>

        <strong className={styles.distanceValue}>{distanceLabel} km</strong>
      </div>
    </section>
  );
}
