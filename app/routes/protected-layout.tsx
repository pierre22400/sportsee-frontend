import { Outlet, Navigate } from "react-router";

/**
 * Protège les routes enfants en vérifiant la session.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Affiche la route enfant avec Outlet sinon.
 */
export default function ProtectedLayout() {
   const isAuthenticated =
    sessionStorage.getItem("sportsee-authenticated") === "true";

      if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}