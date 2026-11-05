import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {useState} from "react";

/**
 * SPORTSEE — FOURNISSEUR DU CONTEXTE D'AUTHENTIFICATION
 *
 * Fournit un token de démonstration aux composants enfants.
 * sessionStorage : conserve la session pendant la durée de vie de l'onglet, y compris après un rechargement.
* useState : conserve l'état React et déclenche la mise à jour de l'interface.
* useContext : permet aux composants de lire cet état et d'utiliser les fonctions partagées.
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

