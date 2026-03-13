import { useState } from 'react'
import { storage } from '../utils/storage'
import { format } from 'date-fns'

export default function RecordList({ records, onEdit, onRefresh }) {
  const [deleteId, setDeleteId] = useState(null)

  function handleDelete(id) {
    if (deleteId === id) {
      storage.deleteHealthRecord(id)
      setDeleteId(null)
      onRefresh && onRefresh()
    } else {
      setDeleteId(id)
      setTimeout(() => setDeleteId(null), 3000)
    }
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-gray-500 text-sm font-medium">还没有健康记录</p>
        <p className="text-gray-400 text-xs mt-1">点击下方「录入」开始记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-4">
      {records.map(record => (
        <div key={record.id} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* 顶部日期栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                {format(new Date(record.recordDate), 'yyyy年MM月dd日')}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(record)}
                className="text-xs text-indigo-500 px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 font-medium"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(record.id)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  deleteId === record.id
                    ? 'bg-red-500 text-white'
                    : 'text-red-400 bg-red-50 hover:bg-red-100'
                }`}
              >
                {deleteId === record.id ? '确认' : '删除'}
              </button>
            </div>
          </div>

          {/* 数据展示 */}
          <div className="px-4 py-3 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">体重</p>
              <p className="text-lg font-bold text-gray-800">{record.weight}</p>
              <p className="text-xs text-gray-400">kg</p>
            </div>
            <div className="text-center border-x border-gray-50">
              <p className="text-xs text-gray-400 mb-1">BMI</p>
              <p className="text-lg font-bold text-indigo-600">{record.bmi}</p>
              <p className="text-xs text-gray-400">指数</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">体脂率</p>
              <p className="text-lg font-bold text-orange-500">{record.bodyFatRate ?? '—'}</p>
              <p className="text-xs text-gray-400">{record.bodyFatRate ? '%' : '未记录'}</p>
            </div>
          </div>

          {record.note && (
            <div className="px-4 pb-3">
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">{record.note}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
