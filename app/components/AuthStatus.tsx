import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * SPORTSEE — LECTURE DU CONTEXTE D'AUTHENTIFICATION
 * Affiche la valeur du token fournie par AuthProvider.
 */
export default function AuthStatus() {
  const auth = useContext(AuthContext);
  if (auth === null) {
  throw new Error("AuthProvider manquant");
}
return (
  <div>
    <p>
      État : {auth.token ? "Connecté" : "Déconnecté"}
    </p>

    <button
      type="button"
      onClick={() => auth.login("token-demo-sportsee")}
    >
      Connexion test
    </button>

    <button
      type="button"
      onClick={auth.logout}
    >
      Déconnexion test
    </button>
  </div>
);
}