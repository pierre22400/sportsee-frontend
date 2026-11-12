
import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import { AuthContext } from "../context/AuthContext";
import { loginSportSee } from "../services/sportseeApi";
import styles from "./login.module.css";

/**
 * SPORTSEE — AUTHENTIFICATION UTILISATEUR
 *
 * Cette page permet de se connecter au backend SportSee.
 *
 * Fonctionnement :
 * 1. L'utilisateur saisit ses identifiants.
 * 2. Le service API envoie une requête POST /api/login.
 * 3. Le backend retourne un JWT après authentification.
 * 4. AuthProvider conserve le JWT dans la session.
 * 5. React Router redirige vers le Dashboard.
 *
 * Le formulaire gère les états de chargement et d'erreur.
 * Aucun jeton fictif n'est utilisé.
 */

/**
 * Affiche le formulaire de connexion SportSee.
 *
 * Les champs sont contrôlés par React avec useState.
 * La session est gérée par AuthProvider.
 */
export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (auth === null) {
    throw new Error("AuthProvider manquant");
  }

  const { login } = auth;

  /**
   * Authentifie l'utilisateur auprès du backend SportSee.
   *
   * Enregistre le JWT après une réponse valide.
   * Affiche un message en cas d'échec.
   * Réinitialise toujours l'état de chargement.
   */
  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await loginSportSee(
        username,
        password,
      );

      login(response.token);

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setError(
        "Connexion impossible. Vérifie tes identifiants et le serveur.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  
return (
  <main className={styles.page}>
    <form
      className={styles.form}
      onSubmit={handleLogin}
    >
      <h1 className={styles.title}>
        Connexion SportSee
      </h1>

      <label
        className={styles.label}
        htmlFor="username"
      >
        Identifiant
      </label>

      <input
        className={styles.input}
        id="username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
        disabled={isLoading}
        required
      />

      <label
        className={styles.label}
        htmlFor="password"
      >
        Mot de passe
      </label>

      <input
        className={styles.input}
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        disabled={isLoading}
        required
      />

      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        className={styles.button}
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Connexion en cours…"
          : "Se connecter"}
      </button>
    </form>
  </main>
);

}
