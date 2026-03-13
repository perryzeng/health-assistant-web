import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import StatCards from './StatCards'
import WeightChart from './WeightChart'
import RecordList from './RecordList'
import { format } from 'date-fns'

export default function Dashboard({ onNeedProfile, onEditRecord }) {
  const [profile, setProfile] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  function loadData() {
    const p = storage.getUserProfile()
    const r = storage.getHealthRecords()
    setProfile(p)
    setRecords(r)
    if (!p) onNeedProfile && onNeedProfile()
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-5">
          <span className="text-4xl">💪</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">欢迎使用健康助手</h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          请先设置个人档案<br />开始你的健康追踪之旅
        </p>
      </div>
    )
  }

  const latest = records[0]
  const today = format(new Date(), 'MM月dd日')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部渐变 Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }} className="px-5 pt-10 pb-16 relative overflow-hidden">
        {/* 装饰圆 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #e94560, transparent)' }} />
        <div className="absolute top-5 right-5 w-20 h-20 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #0f3460, #e94560)' }} />

        <p className="text-indigo-300 text-xs mb-1">{today}</p>
        <h1 className="text-white text-xl font-bold mb-1">
          你好，{profile.nickname || '朋友'} 👋
        </h1>
        <p className="text-indigo-200 text-sm opacity-80">
          {latest ? `上次记录：${latest.weight} kg` : '还没有记录，快去添加吧'}
        </p>
      </div>

      {/* 统计卡片 - 上移覆盖 header */}
      <div className="px-4 -mt-8 relative z-10">
        <StatCards records={records} profile={profile} />
      </div>

      {/* 趋势图 */}
      {records.length >= 2 && (
        <div className="px-4 mt-4">
          <WeightChart records={records} />
        </div>
      )}

      {/* 最近记录 */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">最近记录</h3>
          <span className="text-xs text-gray-400">共 {records.length} 条</span>
        </div>
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-gray-400 text-sm">暂无记录，点击下方「录入」开始</p>
          </div>
        ) : (
          <RecordList records={records.slice(0, 5)} onEdit={onEditRecord} onRefresh={loadData} />
        )}
      </div>
    </div>
  )
}
