import { calculateWeightChange, getBMICategory } from '../utils/calculations'

export default function StatCards({ records, profile }) {
  if (!records || records.length === 0) return null

  const latest = records[0]
  const change = calculateWeightChange(records)
  const bmiInfo = getBMICategory(latest.bmi)
  const targetDiff = profile?.targetWeight ? (latest.weight - profile.targetWeight).toFixed(1) : null

  const bmiColors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  }

  const bmiStyle = bmiColors[bmiInfo.color]

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 体重卡片 - 主卡片 */}
      <div className="col-span-2 bg-white rounded-2xl p-5 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #667eea, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="relative z-10">
          <p className="text-xs text-gray-500 mb-2">当前体重</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-800">{latest.weight}</span>
            <span className="text-sm text-gray-400">kg</span>
          </div>
          {change !== null && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${parseFloat(change) < 0 ? 'bg-green-100 text-green-600' : parseFloat(change) > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                {parseFloat(change) < 0 ? '↓' : parseFloat(change) > 0 ? '↑' : '—'} {Math.abs(change)} kg
              </span>
              <span className="text-xs text-gray-400">较上次</span>
            </div>
          )}
        </div>
      </div>

      {/* BMI 卡片 */}
      <div className={`bg-white rounded-2xl p-4 border ${bmiStyle.border}`} style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="text-xs text-gray-500 mb-2">BMI 指数</p>
        <p className="text-2xl font-bold text-gray-800 mb-1">{latest.bmi}</p>
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${bmiStyle.bg} ${bmiStyle.text}`}>
          {bmiInfo.label}
        </span>
      </div>

      {/* 体脂率卡片 */}
      {latest.bodyFatRate ? (
        <div className="bg-white rounded-2xl p-4 border border-orange-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-xs text-gray-500 mb-2">体脂率</p>
          <p className="text-2xl font-bold text-gray-800 mb-1">{latest.bodyFatRate}</p>
          <span className="text-xs text-gray-400">%</span>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-xs text-purple-600 mb-2">目标体重</p>
          <p className="text-2xl font-bold text-purple-700 mb-1">{profile.targetWeight}</p>
          <span className="text-xs text-purple-500">kg</span>
        </div>
      )}

      {/* 目标进度卡片 */}
      {targetDiff !== null && latest.bodyFatRate && (
        <div className={`col-span-2 rounded-2xl p-4 ${parseFloat(targetDiff) <= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'}`} style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">距离目标</p>
              <p className={`text-xl font-bold ${parseFloat(targetDiff) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {parseFloat(targetDiff) <= 0 ? '🎉 已达标' : `还需 ${targetDiff} kg`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">目标</p>
              <p className="text-lg font-semibold text-gray-700">{profile.targetWeight} kg</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
