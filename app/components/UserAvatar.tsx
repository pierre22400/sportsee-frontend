import { useState } from "react";

import styles from "./UserAvatar.module.css";

/**
 * SPORTSEE — AVATAR UTILISATEUR
 *
 * Composant partagé entre Dashboard et Profil.
 *
 * Affiche la photographie lorsque son URL est valide.
 * En cas d'erreur de chargement, affiche les initiales.
 *
 * Deux formats sont disponibles :
 * - dashboard : avatar du résumé utilisateur ;
 * - profile : avatar de la page Profil.
 *
 * Aucune modification des données utilisateur.
 */

type UserAvatarProps = {
  firstName: string;
  lastName: string;
  src?: string;
  variant: "dashboard" | "profile";
};

/**
 * Affiche la photographie de l'utilisateur ou ses initiales.
 * Mémorise l'URL ayant échoué pour éviter de la recharger.
 */
export default function UserAvatar({
  firstName,
  lastName,
  src,
  variant,
}: UserAvatarProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  const initials = firstName.charAt(0) + lastName.charAt(0);

  const fullName = `${firstName} ${lastName}`;

  const showImage = Boolean(src) && failedSource !== src;

  /** Enregistre l'échec de chargement de la photographie. */
  function handleImageError() {
    setFailedSource(src ?? null);
  }

  return (
    <div
      className={`${styles.avatar} ${styles[variant]}`}
      role="img"
      aria-label={`Avatar de ${fullName}`}
    >
      <span className={styles.fallback} aria-hidden="true">
        {initials}
      </span>

      {showImage && (
        <img
          className={styles.image}
          src={src}
          alt=""
          onError={handleImageError}
        />
      )}
    </div>
  );
}
