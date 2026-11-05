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

/**
 * SPORTSEE — GRAPHIQUE DES ACTIVITÉS
 *
 * Affiche la distance parcourue lors des séances de course.
 * Les données proviennent du mock activity.json.
 *
 * Le graphique s'adapte à la largeur de son conteneur.
 */

/** Affiche les distances parcourues sous forme de barres. */
export default function ActivityChart() {
  const data = activityData.map((activity) => ({
    date: activity.date.slice(8, 10) + "/" + activity.date.slice(5, 7),
    distance: activity.distance,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis unit=" km" />

          <Tooltip />

          <Bar
            dataKey="distance"
            name="Distance"
            unit=" km"
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}