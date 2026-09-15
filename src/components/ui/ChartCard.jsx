import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './ChartCard.scss';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler
);

const GOLD = '#f0a93a';
const GOLD_SOFT = 'rgba(240, 169, 58, 0.16)';
const GRID_COLOR = 'rgba(255, 255, 255, 0.06)';
const TEXT_MUTED = '#a8a49b';

const DOUGHNUT_PALETTE = ['#f0a93a', '#3ec95f', '#5b8def', '#d13b3b', '#a86ee0', '#e0a83c'];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#16130d',
      borderColor: GOLD,
      borderWidth: 1,
      titleColor: '#ffffff',
      bodyColor: '#e9e6df',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: TEXT_MUTED, font: { size: 11 } },
      grid: { color: 'transparent' },
    },
    y: {
      ticks: { color: TEXT_MUTED, font: { size: 11 } },
      grid: { color: GRID_COLOR },
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: { color: TEXT_MUTED, boxWidth: 10, font: { size: 11 }, padding: 14 },
    },
    tooltip: baseOptions.plugins.tooltip,
  },
};

/**
 * type: 'line' | 'bar' | 'doughnut'
 */
export default function ChartCard({ title, sub, type = 'line', labels, data, label, color = GOLD }) {
  const isLine = type === 'line';
  const isDoughnut = type === 'doughnut';

  let chartData;
  let Chart;
  let options;

  if (isDoughnut) {
    chartData = {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: DOUGHNUT_PALETTE,
          borderColor: '#0a0a0a',
          borderWidth: 2,
        },
      ],
    };
    Chart = Doughnut;
    options = doughnutOptions;
  } else {
    chartData = {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          backgroundColor: isLine ? GOLD_SOFT : color,
          pointBackgroundColor: color,
          pointBorderColor: color,
          pointRadius: isLine ? 3 : 0,
          tension: 0.35,
          fill: isLine,
          borderWidth: isLine ? 2.5 : 0,
          borderRadius: isLine ? 0 : 6,
          maxBarThickness: 42,
        },
      ],
    };
    Chart = isLine ? Line : Bar;
    options = baseOptions;
  }

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        {sub && <span className="chart-card__sub">{sub}</span>}
      </div>
      <div className="chart-card__canvas">
        <Chart data={chartData} options={options} />
      </div>
    </div>
  );
}
