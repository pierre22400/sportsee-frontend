import { createContext } from "react";

/**
 * SPORTSEE — CONTEXTE D'AUTHENTIFICATION
 *
 * Définit les données et les actions partagées.
 * Cette version utilise un token de démonstration.
 */

export type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
