
import type { UserInfo } from "../services/sportseeApi";

import styles from "./ProfileSummary.module.css";
import UserAvatar from "./UserAvatar";

/**
 * SPORTSEE — FICHE PROFIL DU TABLEAU DE BORD
 *
 * Affiche les informations personnelles et la distance
 * cumulée reçues depuis le composant parent Dashboard.
 *
 * Le composant ne réalise aucun appel HTTP.
 * Il ne dépend plus du fichier mock userInfo.json.
 *
 * La présentation CSS et le comportement de l'avatar
 * sont conservés.
 */

type ProfileSummaryProps = {
  userInfo: UserInfo;
};

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
 * Affiche le résumé du profil à partir des props.
 *
 * L'avatar conserve son repli vers les initiales
 * si la photographie n'est pas disponible.
 */
export default function ProfileSummary({
  userInfo,
}: ProfileSummaryProps) {
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
    <section
      className={styles.card}
      aria-label="Résumé du profil sportif"
    >
      <UserAvatar
        firstName={profile.firstName}
        lastName={profile.lastName}
        src={profile.profilePicture}
        variant="dashboard"
      />

      <div className={styles.identity}>
        <h2 className={styles.name}>
          {fullName}
        </h2>

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
