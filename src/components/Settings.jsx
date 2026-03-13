import { useState } from 'react'
import { storage } from '../utils/storage'
import { format } from 'date-fns'

export default function Settings({ onEditProfile }) {
  const [showReset, setShowReset] = useState(false)

  function handleExport() {
    const data = storage.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-data-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        storage.importData(data)
        alert('导入成功！请刷新页面查看数据。')
        window.location.reload()
      } catch (err) {
        alert('导入失败：文件格式错误')
      }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (showReset) {
      storage.resetAllData()
      alert('数据已清空')
      window.location.reload()
    } else {
      setShowReset(true)
      setTimeout(() => setShowReset(false), 5000)
    }
  }

  const profile = storage.getUserProfile()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="px-5 py-6 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">⚙️</span>
        </div>
        <h1 className="text-xl font-bold text-white">设置</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 个人档案 */}
        {profile && (
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">个人档案</h3>
              <button
                onClick={onEditProfile}
                className="text-xs text-indigo-500 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 font-semibold"
              >
                编辑
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">昵称</span>
                <span className="text-sm font-semibold text-gray-800">{profile.nickname || '未设置'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">性别</span>
                <span className="text-sm font-semibold text-gray-800">{profile.gender === 'male' ? '👨 男' : '👩 女'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">年龄</span>
                <span className="text-sm font-semibold text-gray-800">{profile.age} 岁</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">身高</span>
                <span className="text-sm font-semibold text-gray-800">{profile.height} cm</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">目标体重</span>
                <span className="text-sm font-semibold text-gray-800">{profile.targetWeight} kg</span>
              </div>
            </div>
          </div>
        )}

        {/* 数据管理 */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 className="text-sm font-bold text-gray-800 mb-4">数据管理</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 py-3.5 rounded-xl text-sm font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all border border-indigo-100"
            >
              📥 导出数据
            </button>

            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 py-3.5 rounded-xl text-sm font-semibold hover:from-green-100 hover:to-emerald-100 transition-all text-center cursor-pointer border border-green-100">
                📤 导入数据
              </div>
            </label>

            <button
              onClick={handleReset}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all border ${
                showReset
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border-red-100'
              }`}
            >
              {showReset ? '⚠️ 确认清空所有数据' : '🗑️ 清空所有数据'}
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 className="text-sm font-bold text-gray-800 mb-3">关于</h3>
          <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-700">健康助手 v1.0</p>
            <p>数据完全存储在本地浏览器，保护隐私安全。</p>
            <p>建议定期导出数据备份。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
