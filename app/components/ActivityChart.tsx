import { useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import activityData from "../mocks/activity.json";
import styles from "./ActivityChart.module.css";

/**
 * SPORTSEE — GRAPHIQUE DES ACTIVITÉS
 *
 * Affiche la distance parcourue lors des séances de course.
 * Les données proviennent du mock activity.json.
 *
 * Regroupe les distances par semaine civile (lundi-dimanche).
 * Affiche une fenêtre glissante de quatre semaines.
 * Chaque clic déplace cette fenêtre d'une semaine.
 *
 * La moyenne est recalculée sur la période visible.
 * Les données originales ne sont jamais modifiées.
 * Le graphique s'adapte à la largeur de son conteneur.
 */

type Activity = {
  date: string;
  distance: number;
};

type WeeklyDistance = {
  monday: string;
  distance: number;
};

const WINDOW_SIZE = 4;

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
 * Retourne la date ISO du lundi de la semaine
 * à laquelle appartient une séance.
 */
function getMonday(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  const day = date.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;

  date.setUTCDate(date.getUTCDate() - daysSinceMonday);

  return date.toISOString().slice(0, 10);
}

/**
 * Retourne le lundi de la semaine suivante.
 */
function getNextMonday(monday: string): string {
  const date = new Date(`${monday}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() + 7);

  return date.toISOString().slice(0, 10);
}

/**
 * Regroupe les distances par semaine.
 *
 * Conserve les semaines sans séance entre la première
 * et la dernière semaine enregistrées, avec zéro km.
 *
 * Ne modifie jamais le tableau source.
 */
function buildWeeklyDistances(
  activities: readonly Activity[],
): WeeklyDistance[] {
  const totals = activities.reduce((weeklyTotals, activity) => {
    const monday = getMonday(activity.date);

    weeklyTotals.set(
      monday,
      (weeklyTotals.get(monday) ?? 0) + activity.distance,
    );

    return weeklyTotals;
  }, new Map<string, number>());

  const mondays = [...totals.keys()].sort();

  if (mondays.length === 0) {
    return [];
  }

  const firstMonday = mondays[0];
  const lastMonday = mondays[mondays.length - 1];

  const weeks: WeeklyDistance[] = [];

  let monday = firstMonday;

  while (monday <= lastMonday) {
    weeks.push({
      monday,
      distance: Number((totals.get(monday) ?? 0).toFixed(1)),
    });

    monday = getNextMonday(monday);
  }

  return weeks;
}

/**
 * Calcule la moyenne des distances des semaines visibles.
 * Retourne null si aucune semaine n'est disponible.
 */
function getWeeklyAverage(weeks: readonly WeeklyDistance[]): number | null {
  if (weeks.length === 0) {
    return null;
  }

  const total = weeks.reduce((sum, week) => sum + week.distance, 0);

  return total / weeks.length;
}

/**
 * Formate la période du premier lundi au dernier dimanche
 * des semaines actuellement affichées.
 */
function formatPeriod(weeks: readonly WeeklyDistance[]): string {
  if (weeks.length === 0) {
    return "Aucune période";
  }

  const first = new Date(`${weeks[0].monday}T00:00:00Z`);

  const last = new Date(`${weeks[weeks.length - 1].monday}T00:00:00Z`);

  last.setUTCDate(last.getUTCDate() + 6);

  return `${dateFormatter.format(first)} – ` + dateFormatter.format(last);
}

/**
 * Affiche les distances hebdomadaires sous forme de barres.
 * Permet de naviguer dans une fenêtre de quatre semaines.
 */
export default function ActivityChart() {
const weeklyData = buildWeeklyDistances(activityData);
  const [windowStart, setWindowStart] = useState(() =>
    Math.max(0, weeklyData.length - WINDOW_SIZE),
  );

  const maxStart = Math.max(0, weeklyData.length - WINDOW_SIZE);

  const safeStart = Math.min(windowStart, maxStart);

  const visibleWeeks = weeklyData
    .slice(safeStart, safeStart + WINDOW_SIZE)
    .map((week, index) => ({
      ...week,
      label: `S${index + 1}`,
    }));

  const average = getWeeklyAverage(visibleWeeks);

  const averageLabel =
    average === null ? "—" : distanceFormatter.format(average);

  const periodLabel = formatPeriod(visibleWeeks);

  /** Recule la fenêtre d'une semaine sans dépasser le début. */
  function handlePrevious() {
    setWindowStart((previous) => Math.max(0, previous - 1));
  }

  /** Avance la fenêtre d'une semaine sans dépasser la fin. */
  function handleNext() {
    setWindowStart((previous) => Math.min(maxStart, previous + 1));
  }

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.value}>{averageLabel} km en moyenne</h2>

          <p className={styles.subtitle}>
            Moyenne hebdomadaire sur les quatre semaines affichées
          </p>
        </div>

        <nav
          className={styles.navigation}
          aria-label="Navigation entre les semaines"
        >
          <button
            type="button"
            onClick={handlePrevious}
            disabled={safeStart === 0}
            aria-label="Période précédente"
          >
            ‹
          </button>

          <span className={styles.period} aria-live="polite">
            {periodLabel}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={safeStart >= maxStart}
            aria-label="Période suivante"
          >
            ›
          </button>
        </nav>
      </header>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visibleWeeks}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="label" tickLine={false} />

            <YAxis domain={[0, "auto"]} tickLine={false} />

            <Tooltip />

            <Bar
              dataKey="distance"
              name="Distance"
              unit=" km"
              fill="#B6BFFF"
              barSize={14}
              radius={[7, 7, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
