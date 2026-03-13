import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { filterRecordsByDays } from '../utils/calculations'
import { format } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function WeightChart({ records }) {
  const [days, setDays] = useState(30)

  const filtered = filterRecordsByDays(records, days).reverse()

  if (filtered.length < 2) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="text-gray-400 text-sm">数据不足，至少需要 2 条记录才能显示趋势</p>
      </div>
    )
  }

  const data = {
    labels: filtered.map(r => format(new Date(r.recordDate), 'MM/dd')),
    datasets: [
      {
        label: '体重',
        data: filtered.map(r => r.weight),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#a0aec0',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: (val) => `${val}`,
        },
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">体重趋势</h3>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                days === d
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {d}天
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: '180px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
