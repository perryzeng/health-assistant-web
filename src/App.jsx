import { useState, useEffect } from 'react'
import { storage } from './utils/storage'
import Dashboard from './components/Dashboard'
import RecordForm from './components/RecordForm'
import RecordList from './components/RecordList'
import AIAdvice from './components/AIAdvice'
import Settings from './components/Settings'
import ProfileSetup from './components/ProfileSetup'

const TABS = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'record', label: '录入', icon: '➕' },
  { id: 'advice', label: '建议', icon: '🤖' },
  { id: 'settings', label: '设置', icon: '⚙️' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [showProfile, setShowProfile] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(() => {
    const profile = storage.getUserProfile()
    if (!profile) setShowProfile(true)
    setRecords(storage.getHealthRecords())
  }, [])

  function refreshRecords() {
    setRecords(storage.getHealthRecords())
  }

  function handleEditRecord(record) {
    setEditRecord(record)
    setTab('record')
  }

  function handleRecordSaved() {
    setEditRecord(null)
    refreshRecords()
    setTab('home')
  }

  if (showProfile) {
    return (
      <ProfileSetup
        onSave={() => {
          setShowProfile(false)
          refreshRecords()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto pb-16">
        {tab === 'home' && (
          <Dashboard
            onNeedProfile={() => setShowProfile(true)}
            onEditRecord={handleEditRecord}
          />
        )}
        {tab === 'record' && (
          <div>
            <RecordForm
              editRecord={editRecord}
              onSave={handleRecordSaved}
              onCancel={() => { setEditRecord(null); setTab('home') }}
            />
            {!editRecord && (
              <div className="mt-2">
                <div className="px-4 py-3 bg-white border-t">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">历史记录</h3>
                </div>
                <RecordList
                  records={records}
                  onEdit={handleEditRecord}
                  onRefresh={refreshRecords}
                />
              </div>
            )}
          </div>
        )}
        {tab === 'advice' && <AIAdvice />}
        {tab === 'settings' && (
          <Settings onEditProfile={() => setShowProfile(true)} />
        )}
      </div>

      {/* 底部 Tab 导航 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 flex z-50" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setEditRecord(null) }}
            className={`flex-1 flex flex-col items-center py-3 text-xs transition-all ${
              tab === t.id ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <span className={`text-xl mb-1 transition-transform ${tab === t.id ? 'scale-110' : ''}`}>{t.icon}</span>
            <span className={`font-medium ${tab === t.id ? 'text-indigo-600' : ''}`}>{t.label}</span>
            {tab === t.id && (
              <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
