import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import activityData from "../mocks/activity.json";
import styles from "./WeeklySummary.module.css";

/**
 * SPORTSEE — BILAN HEBDOMADAIRE
 *
 * Affiche le nombre de courses, la distance totale
 * et la durée cumulée sur une semaine.
 *
 * La semaine de référence est la dernière semaine
 * enregistrée dans le mock, et non la semaine civile
 * actuelle.
 *
 * L'objectif de six courses est provisoire :
 * il sert uniquement à reproduire la maquette.
 *
 * Les données sources ne sont jamais modifiées.
 * Le graphique reste responsive et accessible.
 */

type Activity = {
  date: string;
  distance: number;
  duration: number;
};

type WeeklyStats = {
  monday: string | null;
  sessions: number;
  distance: number;
  duration: number;
};

const WEEKLY_GOAL = 6;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const distanceFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Retourne le lundi correspondant à une date ISO.
 */
function getMonday(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;

  date.setUTCDate(date.getUTCDate() - daysSinceMonday);

  return date.toISOString().slice(0, 10);
}

/**
 * Ajoute un nombre de jours à une date ISO.
 */
function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

/**
 * Calcule les statistiques de la dernière semaine
 * pour laquelle une séance est enregistrée.
 *
 * Retourne des statistiques vides en l'absence
 * de séances.
 */
function buildWeeklyStats(activities: readonly Activity[]): WeeklyStats {
  if (activities.length === 0) {
    return {
      monday: null,
      sessions: 0,
      distance: 0,
      duration: 0,
    };
  }

  const latestDate = activities.reduce(
    (latest, activity) => (activity.date > latest ? activity.date : latest),
    "",
  );

  const monday = getMonday(latestDate);
  const sunday = addDays(monday, 6);

  const weeklyActivities = activities.filter(
    (activity) => activity.date >= monday && activity.date <= sunday,
  );

  return {
    monday,
    sessions: weeklyActivities.length,
    distance: weeklyActivities.reduce(
      (total, activity) => total + activity.distance,
      0,
    ),
    duration: weeklyActivities.reduce(
      (total, activity) => total + activity.duration,
      0,
    ),
  };
}

/**
 * Convertit une durée en minutes en texte lisible.
 */
/**
 * Formate la durée totale en minutes,
 * sans conversion en heures.
 */
function formatDuration(minutes: number): string {
  return new Intl.NumberFormat("fr-FR").format(minutes);
}

/**
 * Formate la période de référence du lundi au dimanche.
 */
function formatPeriod(monday: string | null): string {
  if (monday === null) {
    return "Aucune séance disponible";
  }

  const sunday = addDays(monday, 6);

  return (
    dateFormatter.format(new Date(`${monday}T00:00:00Z`)) +
    " – " +
    dateFormatter.format(new Date(`${sunday}T00:00:00Z`))
  );
}

/**
 * Affiche un anneau de progression et les
 * statistiques de la dernière semaine enregistrée.
 */
export default function WeeklySummary() {
  const stats = buildWeeklyStats(activityData);

  const completed = Math.min(stats.sessions, WEEKLY_GOAL);
  const remaining = Math.max(0, WEEKLY_GOAL - completed);

  const chartData = [
    { name: "Réalisées", value: completed },
    { name: "Restantes", value: remaining },
  ];

  return (
    <section className={styles.summary}>
      <header className={styles.heading}>
        <h2 className={styles.title}>Cette semaine</h2>

        <p className={styles.subtitle}>
          Historique de démonstration : {formatPeriod(stats.monday)}
        </p>
      </header>

      <div className={styles.content}>
        {/* Carte 1 : objectif hebdomadaire */}
        <div className={`${styles.card} ${styles.goalCard}`}>
          <p className={styles.goalValue}>
            <strong>×{stats.sessions}</strong>
            <span> sur un objectif de {WEEKLY_GOAL}</span>
          </p>

          <p className={styles.goalDescription}>
            Courses hebdomadaires réalisées
          </p>


<div className={styles.donutStage}>
  <div
    className={styles.donut}
    role="img"
    aria-label={
      `${stats.sessions} courses réalisées, ` +
      `objectif illustratif de ${WEEKLY_GOAL}`
    }
  >
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          innerRadius={62}
          outerRadius={82}
          startAngle={90}
          endAngle={-270}
          stroke="none"
          isAnimationActive={false}
        >
          <Cell fill="#1738FF" />
          <Cell fill="#DCE1FF" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className={styles.legend} aria-hidden="true">
    <span className={styles.legendDone}>
      <span className={styles.doneDot} />
      {stats.sessions} réalisées
    </span>

    <span className={styles.legendRemaining}>
      <span className={styles.remainingDot} />
      {remaining} restantes
    </span>
  </div>
</div>


          <p className={styles.note}>
            Objectif de {WEEKLY_GOAL} courses : valeur provisoire de la
            maquette.
          </p>
        </div>

        {/* Cartes 2 et 3 : statistiques */}
        <div className={styles.stats}>
          <article className={styles.statCard}>
            <p className={styles.label}>Durée d'activité</p>
<p className={styles.durationValue}>
  {formatDuration(stats.duration)}{" "}
  <span className={styles.durationUnit}>
    {stats.duration === 1 ? "minute" : "minutes"}
  </span>
</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.label}>Distance</p>

<p className={styles.distanceValue}>
  {distanceFormatter.format(stats.distance)}{" "}
  <span className={styles.distanceUnit}>
    kilomètres
  </span>
</p>
          </article>
        </div>
      </div>
    </section>
  );
}
