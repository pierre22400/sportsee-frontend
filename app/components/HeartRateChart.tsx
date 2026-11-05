
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
 */

type Activity = {
  date: string;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
};

type HeartRatePoint = {
  date: string;
  min: number;
  max: number;
  average: number;
};

/**
 * Prépare les données des séances pour Recharts.
 * Trie les séances par date sans modifier le tableau source.
 */
function buildHeartRateData(
  activities: readonly Activity[],
): HeartRatePoint[] {
  return [...activities]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((activity) => ({
      date:
        activity.date.slice(8, 10) +
        "/" +
        activity.date.slice(5, 7),
      min: activity.heartRate.min,
      max: activity.heartRate.max,
      average: activity.heartRate.average,
    }));
}

/**
 * Calcule la moyenne arithmétique des fréquences
 * cardiaques moyennes de chaque séance.
 */
function getAverageHeartRate(
  data: readonly HeartRatePoint[],
): number {
  if (data.length === 0) {
    return 0;
  }

  const total = data.reduce(
    (sum, session) => sum + session.average,
    0,
  );

  return Math.round(total / data.length);
}

/**
 * Affiche une carte responsive contenant
 * les mesures cardiaques des séances.
 */
export default function HeartRateChart() {
  const data = buildHeartRateData(activityData);
  const averageBpm = getAverageHeartRate(data);

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.value}>
          {data.length > 0 ? `${averageBpm} BPM` : "— BPM"}
        </h2>
        <p className={styles.subtitle}>
          Fréquence cardiaque moyenne des séances
        </p>
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
              dataKey="date"
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
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
