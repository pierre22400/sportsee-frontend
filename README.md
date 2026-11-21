
# SportSee — Frontend React

Application de suivi des performances sportives développée
dans le cadre de la formation OpenClassrooms
« Développeur d'application React ».

## Prérequis

- Node.js compatible avec React Router (version > 22.22.0)
- npm
- Le backend SportSee, disponible séparément

## Installation

Dans le dossier `sportsee-frontend` :

```powershell
npm.cmd install
```

## Démarrer le backend

Dans un premier terminal, ouvrir le dossier `sportsee-backend` :

```powershell
npm.cmd install
npm.cmd run dev
```

Le serveur Express démarre sur :

http://localhost:8000

## Démarrer le frontend

Dans un second terminal, ouvrir le dossier `sportsee-frontend` :

```powershell
npm.cmd run dev
```

L'application est accessible sur :

http://localhost:5173

En cas de problème de résolution IPv4/IPv6 sous Windows :

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

Puis ouvrir :

http://127.0.0.1:5173

La page d'accueil redirige vers `/login`.

## Vérifications

Contrôle TypeScript :

```powershell
npm.cmd run typecheck
```

Compilation de production :

```powershell
npm.cmd run build
```

## Fonctionnalités

- Authentification avec le backend SportSee
- Tableau de bord des performances sportives
- Graphiques d'activité et de fréquence cardiaque
- Bilan hebdomadaire
- Page Profil


## Source des données : API ou Mock

SportSee permet de choisir la provenance des données
sportives sans modifier les composants React.

Le réglage se trouve dans :

`app/services/sportseeApi.ts`

### Mode API (par défaut)

```typescript
const USE_MOCK = false;
```

Les fonctions `getUserInfo()` et `getUserActivities()`
récupèrent les données depuis le backend Express,
à l'adresse `http://localhost:8000`.

Le backend doit être démarré.

### Mode Mock (démonstration)

Pour utiliser les données fictives, remplacer la
constante par :

```typescript
const USE_MOCK = true;
```

Les données sont alors chargées depuis :

- `app/mocks/userInfo.json`
- `app/mocks/activity.json`

Les deux fonctions retournent les données locales
au lieu d'effectuer leurs requêtes GET vers l'API.

Après modification, enregistrer le fichier et
actualiser l'application dans le navigateur.

### Important : authentification

Le choix API/Mock concerne uniquement les données
du profil et des activités sportives.

L'authentification reste effectuée via
`POST /api/login`, auprès du backend Express.

Le mode Mock ne constitue donc pas un mode
entièrement autonome sans backend.

### Recommandation

Conserver `USE_MOCK = false` avant de livrer
ou de présenter la version utilisant l'API réelle.
