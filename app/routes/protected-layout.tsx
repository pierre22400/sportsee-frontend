import { Outlet, Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Protège les routes enfants en vérifiant la session.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Affiche la route enfant avec Outlet sinon.
 */
export default function ProtectedLayout() {

const auth = useContext(AuthContext);
const isAuthenticated = Boolean(auth.token);

if (auth === null) {
  throw new Error("AuthProvider manquant");
}

      if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}