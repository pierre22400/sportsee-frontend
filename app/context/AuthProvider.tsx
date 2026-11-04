import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {useState} from "react";

/**
 * SPORTSEE — FOURNISSEUR DU CONTEXTE D'AUTHENTIFICATION
 *
 * Fournit un token de démonstration aux composants enfants.
 */
export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
const [token, setToken] = useState<string | null>(() =>
  sessionStorage.getItem("sportsee-token")
);
/** Enregistre le token et actualise l'état React. */
function login(newToken: string) {
  sessionStorage.setItem("sportsee-token", newToken);
  setToken(newToken);
}

/** Supprime le token et actualise l'état React. */
function logout() {
  sessionStorage.removeItem("sportsee-token");
  setToken(null);
}
return (
<AuthContext.Provider value={{ token, login, logout }}>
  {children}
</AuthContext.Provider>
);
}

