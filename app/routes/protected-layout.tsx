import { useContext } from "react";

import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router";

import { AuthContext } from "../context/AuthContext";
import styles from "./protected-layout.module.css";

/**
 * SPORTSEE — LAYOUT PARTAGÉ DES PAGES PROTÉGÉES
 *
 * Gère :
 * - le contrôle de la session ;
 * - le logo SportSee ;
 * - la navigation Dashboard / Profil ;
 * - la déconnexion ;
 * - le pied de page commun.
 *
 * Le contenu de chaque route est rendu par Outlet.
 * Aucune donnée sportive n'est modifiée ici.
 */

/**
 * Affiche le symbole décoratif SportSee.
 *
 * Les barres rouges constituent une approximation
 * CSS du pictogramme de la maquette Figma.
 */
function SportSeeMark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

/**
 * Protège les routes enfants en vérifiant la session.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Affiche la route enfant avec Outlet sinon.
 */
export default function ProtectedLayout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (auth === null) {
    throw new Error("AuthProvider manquant");
  }

  const { token, logout } = auth;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /** Supprime la session et revient à la connexion. */
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link
            to="/dashboard"
            className={styles.brand}
            aria-label="SportSee - Tableau de bord"
          >
            <SportSeeMark />
            <span>SPORTSEE</span>
          </Link>

          <nav className={styles.navigation} aria-label="Navigation principale">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Mon profil
            </NavLink>

            <span className={styles.separator} aria-hidden="true" />

            <button
              type="button"
              className={styles.logout}
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </nav>
        </div>
      </header>

      <div className={styles.content}>
        <Outlet />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.copyright}>© SportSee — Tous droits réservés</p>

          <div className={styles.footerRight}>
            <span>Conditions générales</span>

            <span>Contact</span>

            <span className={styles.footerMark}>
              <SportSeeMark />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
