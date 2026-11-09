import { useState } from "react";

import userInfo from "../mocks/userInfo.json";
import styles from "./ProfileSummary.module.css";

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
  const [imageFailed, setImageFailed] = useState(false);
  const { profile, statistics } = userInfo;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials =
    profile.firstName.charAt(0) + profile.lastName.charAt(0);
  const memberSince = dateFormatter.format(
    new Date(`${profile.createdAt}T00:00:00Z`),
  );
  const totalDistance = Number(statistics.totalDistance);
  const distanceLabel = Number.isFinite(totalDistance)
    ? distanceFormatter.format(totalDistance)
    : "—";

  /** Remplace la photo inaccessible par les initiales. */
  function handleImageError() {
    setImageFailed(true);
  }

  return (
    <section
      className={styles.card}
      aria-label="Résumé du profil sportif"
    >
      <div className={styles.avatar}>
        <span className={styles.avatarFallback} aria-hidden="true">
          {initials}
        </span>

        {!imageFailed && (
          <img
            className={styles.avatarImage}
            src={profile.profilePicture}
            alt={`Portrait de ${fullName}`}
            onError={handleImageError}
          />
        )}
      </div>

      <div className={styles.identity}>
        <h2 className={styles.name}>{fullName}</h2>
        <p className={styles.memberSince}>
          Membre depuis le {memberSince}
        </p>
      </div>

      <div className={styles.distance}>
        <span className={styles.distanceLabel}>
          Distance totale parcourue
        </span>

        <strong className={styles.distanceValue}>
          {distanceLabel} km
        </strong>
      </div>
    </section>
  );
}
