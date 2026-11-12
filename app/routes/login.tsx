
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
  const [resetNotice, setResetNotice] = useState(false);

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
      <section
        className={styles.leftPanel}
        aria-labelledby="login-title"
      >
        <div className={styles.leftContent}>
          <div className={styles.brand} aria-label="SportSee">
            <span className={styles.brandMark} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>SPORTSEE</span>
          </div>

          <form
            className={styles.form}
            onSubmit={handleLogin}
          >
            <h1 className={styles.title} id="login-title">
              Transformez
              <span>vos stats en résultats</span>
            </h1>

            <h2 className={styles.formTitle}>
              Se connecter
            </h2>

            <div className={styles.field}>
              <label
                className={styles.label}
                htmlFor="username"
              >
                Adresse email ou identifiant
              </label>

              <input
                className={styles.input}
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.field}>
              <label
                className={styles.label}
                htmlFor="password"
              >
                Mot de passe
              </label>

              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours…" : "Se connecter"}
            </button>

            <button
              className={styles.forgotPassword}
              type="button"
              onClick={() => setResetNotice((visible) => !visible)}
              aria-expanded={resetNotice}
            >
              Mot de passe oublié ?
            </button>

            {resetNotice && (
              <p className={styles.resetNotice} role="status">
                La récupération du mot de passe n'est pas disponible
                pour les comptes de démonstration SportSee.
              </p>
            )}
          </form>
        </div>
      </section>

      <aside className={styles.visualPanel} aria-label="Univers de la course à pied">
        <p className={styles.visualCaption}>
          Analysez vos performances en un clin d’œil,
          suivez vos progrès et atteignez vos objectifs.
        </p>
      </aside>
    </main>
  );
}
