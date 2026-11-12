
/**
 * SPORTSEE — SERVICE DE COMMUNICATION AVEC L'API REST
 *
 * Ce module centralise les échanges avec le backend Express.
 *
 * Trois opérations sont disponibles :
 * 1. loginSportSee() : authentification et récupération du JWT.
 * 2. getUserInfo() : récupération du profil et des statistiques.
 * 3. getUserActivities() : récupération des séances sur une période.
 *
 * Les requêtes protégées utilisent le JWT dans l'en-tête
 * Authorization: Bearer <token>.
 *
 * Les erreurs HTTP sont converties en exceptions.
 * Les composants React pourront les gérer avec try/catch.
 *
 * Les requêtes GET acceptent un AbortSignal afin de permettre
 * leur annulation lors d'un changement de page ou de période.
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Réponse du serveur après une authentification réussie.
 */
export type LoginResponse = {
  token: string;
  userId: string;
};

/**
 * Profil et statistiques globales de l'utilisateur.
 */
export type UserInfo = {
  profile: {
    firstName: string;
    lastName: string;
    createdAt: string;
    age: number;
    weight: number;
    height: number;
    profilePicture: string;
  };
  statistics: {
    totalDistance: string;
    totalSessions: number;
    totalDuration: number;
  };
};

/**
 * Structure d'une séance sportive retournée par l'API.
 */
export type Activity = {
  date: string;
  distance: number;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
  caloriesBurned: number;
};

/**
 * Exécute une requête HTTP et retourne sa réponse JSON.
 *
 * Le type générique T décrit les données attendues.
 *
 * fetch() ne déclenche pas automatiquement d'exception
 * pour les réponses HTTP 400, 401, 403 ou 500.
 * Nous vérifions donc explicitement response.ok.
 *
 * Une erreur réseau ou une annulation est propagée.
 */
async function requestJson<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    options,
  );

  if (!response.ok) {
    throw new Error(
      `Erreur SportSee API : HTTP ${response.status}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Authentifie un utilisateur auprès du backend SportSee.
 *
 * Envoie une requête POST /api/login avec les identifiants.
 * Retourne un JWT et l'identifiant de l'utilisateur.
 *
 * Le JWT sera ensuite conservé par AuthProvider.
 */
export function loginSportSee(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return requestJson<LoginResponse>("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

/**
 * Récupère le profil et les statistiques globales.
 *
 * Le JWT est transmis dans l'en-tête Authorization.
 * Le signal optionnel permet d'annuler la requête.
 */
export function getUserInfo(
  token: string,
  signal?: AbortSignal,
): Promise<UserInfo> {
  return requestJson<UserInfo>("/api/user-info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}

/**
 * Récupère les activités comprises entre deux dates.
 *
 * startWeek et endWeek utilisent le format YYYY-MM-DD.
 *
 * URLSearchParams construit et encode les paramètres
 * de la requête de manière sûre.
 *
 * Le signal optionnel permet d'annuler la requête
 * lorsque l'utilisateur change de période.
 */
export function getUserActivities(
  token: string,
  startWeek: string,
  endWeek: string,
  signal?: AbortSignal,
): Promise<Activity[]> {
  const params = new URLSearchParams({
    startWeek,
    endWeek,
  });

  return requestJson<Activity[]>(
    `/api/user-activity?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    },
  );
}
