
import { useState } from "react";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import activityData from "../mocks/activity.json";
import styles from "./HeartRateChart.module.css";

/**
 * SPORTSEE — GRAPHIQUE DE FRÉQUENCE CARDIAQUE
 *
 * Transforme les séances du fichier JSON en séries graphiques.
 *
 * Affiche :
 * - la fréquence minimale sous forme de barres claires ;
 * - la fréquence maximale sous forme de barres rouges ;
 * - la fréquence moyenne sous forme de courbe bleue.
 *
 * Les données originales ne sont jamais modifiées.
 * Le graphique reste responsive.
 *
 * Fonctionnalités complémentaires :
 * - regroupement des séances par journée ;
 * - moyenne pondérée par la durée des séances ;
 * - affichage du lundi au dimanche ;
 * - absence de mesure représentée par null ;
 * - navigation par semaines complètes.
 */

type Activity = {
  date: string;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
};

type HeartRatePoint = {
  date: string;
  day: string;
  min: number | null;
  max: number | null;
  average: number | null;
  duration: number;
};

const DAY_LABELS = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
];

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
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
 * Ajoute un nombre de jours à une date ISO,
 * sans décalage de fuseau horaire.
 */
function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

/**
 * Construit la liste chronologique des lundis
 * entre la première et la dernière séance.
 */
function buildWeekStarts(
  activities: readonly Activity[],
): string[] {
  if (activities.length === 0) {
    return [];
  }

  const mondays = activities
    .map((activity) => getMonday(activity.date))
    .sort();

  const firstMonday = mondays[0];
  const lastMonday = mondays[mondays.length - 1];

  const weeks: string[] = [];

  for (
    let monday = firstMonday;
    monday <= lastMonday;
    monday = addDays(monday, 7)
  ) {
    weeks.push(monday);
  }

  return weeks;
}

/**
 * Prépare les données des séances pour Recharts.
 * Trie les séances par date sans modifier le tableau source.
 *
 * Regroupe les séances du même jour et retourne
 * exactement sept positions, du lundi au dimanche.
 */
function buildHeartRateData(
  activities: readonly Activity[],
  monday: string,
): HeartRatePoint[] {
  const sunday = addDays(monday, 6);

  const sessionsByDay = new Map<string, Activity[]>();

  for (const activity of activities) {
    if (activity.date < monday || activity.date > sunday) {
      continue;
    }

    const sessions = sessionsByDay.get(activity.date) ?? [];
    sessions.push(activity);
    sessionsByDay.set(activity.date, sessions);
  }

  return DAY_LABELS.map((day, index) => {
    const date = addDays(monday, index);
    const sessions = sessionsByDay.get(date) ?? [];

    if (sessions.length === 0) {
      return {
        date,
        day,
        min: null,
        max: null,
        average: null,
        duration: 0,
      };
    }

    const duration = sessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    const weightedTotal = sessions.reduce(
      (sum, session) =>
        sum +
        session.heartRate.average * session.duration,
      0,
    );

    return {
      date,
      day,
      min: Math.min(
        ...sessions.map((session) => session.heartRate.min),
      ),
      max: Math.max(
        ...sessions.map((session) => session.heartRate.max),
      ),
      average:
        duration > 0 ? weightedTotal / duration : null,
      duration,
    };
  });
}

/**

 * Pour la nouvelle fenêtre quotidienne, utilise
 * une pondération par la durée des séances.
 * Retourne null lorsqu'aucune mesure n'est disponible.
 */
function getAverageHeartRate(
  data: readonly HeartRatePoint[],
): number | null {
  const duration = data.reduce(
    (sum, day) => sum + day.duration,
    0,
  );

  if (duration === 0) {
    return null;
  }

  const weightedTotal = data.reduce(
    (sum, day) =>
      sum + (day.average ?? 0) * day.duration,
    0,
  );

  return Math.round(weightedTotal / duration);
}

/**
 * Formate les bornes de la semaine affichée.
 */
function formatPeriod(monday: string | undefined): string {
  if (!monday) {
    return "Aucune période";
  }

  const sunday = addDays(monday, 6);

  return (
    dateFormatter.format(new Date(`${monday}T00:00:00Z`)) +
    " – " +
    dateFormatter.format(new Date(`${sunday}T00:00:00Z`))
  );
}

/**
 * Affiche une carte responsive contenant
 * les mesures cardiaques des séances.
 *
 * Les flèches changent de semaine complète.
 */
export default function HeartRateChart() {
  const weekStarts = buildWeekStarts(activityData);

  const [weekIndex, setWeekIndex] = useState(() =>
    Math.max(0, weekStarts.length - 1),
  );

  const maxIndex = Math.max(0, weekStarts.length - 1);
  const safeIndex = Math.min(weekIndex, maxIndex);

  const selectedMonday = weekStarts[safeIndex];

  const data = selectedMonday
    ? buildHeartRateData(activityData, selectedMonday)
    : [];

  const averageBpm = getAverageHeartRate(data);
  const periodLabel = formatPeriod(selectedMonday);

  /** Affiche la semaine précédente. */
  function handlePrevious() {
    setWeekIndex((previous) => Math.max(0, previous - 1));
  }

  /** Affiche la semaine suivante. */
  function handleNext() {
    setWeekIndex((previous) =>
      Math.min(maxIndex, previous + 1),
    );
  }

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.value}>
            {averageBpm === null
              ? "— BPM"
              : `${averageBpm} BPM`}
          </h2>

        </div>

        <p className={styles.subtitle}>
          Fréquence cardiaque moyenne des séances
        </p>

        <nav
          className={styles.navigation}
          aria-label="Navigation des semaines cardiaques"
        >
          <button
            type="button"
            onClick={handlePrevious}
            disabled={safeIndex === 0}
            aria-label="Semaine précédente"
          >
            ‹
          </button>

          <span
            className={styles.period}
            aria-live="polite"
          >
            {periodLabel}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={safeIndex >= maxIndex}
            aria-label="Semaine suivante"
          >
            ›
          </button>
        </nav>
      </header>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 15,
              bottom: 10,
              left: 0,
            }}
          >
            <CartesianGrid
              stroke="#eeeeee"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              tickLine={false}
              axisLine={false}
              width={42}
            />

            <Tooltip />

            <Legend verticalAlign="bottom" />

            <Bar
              dataKey="min"
              name="Min"
              unit=" BPM"
              fill="#f7b8ae"
              barSize={13}
              radius={[6, 6, 6, 6]}
            />

            <Bar
              dataKey="max"
              name="Max"
              unit=" BPM"
              fill="#f23617"
              barSize={13}
              radius={[6, 6, 6, 6]}
            />

            <Line
              type="monotone"
              dataKey="average"
              name="Moyenne"
              unit=" BPM"
              stroke="#1936ff"
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
