import { Navigate } from "react-router";
import type { Route } from "./+types/home";

/**
 * SPORTSEE — PAGE D'ACCUEIL
 *
 * Redirige la racine du site vers la connexion.
 * Les routes Dashboard et Profil restent protégées
 * par le composant ProtectedLayout.
 */

/**
 * Définit les métadonnées de la page d'accueil.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "SportSee" },
    {
      name: "description",
      content: "Tableau de bord sportif SportSee",
    },
  ];
}

/**
 * Redirige la racine du site vers /login.
 */
export default function Home() {
  return <Navigate to="/login" replace />;
}
