import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { getHealthAdvice } from '../utils/api'
import { format } from 'date-fns'

export default function AIAdvice() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [advices, setAdvices] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setAdvices(storage.getAIAdvices())
  }, [])

  async function handleGenerate() {
    const profile = storage.getUserProfile()
    const records = storage.getHealthRecords()

    if (!profile) {
      setError('请先设置个人档案')
      return
    }
    if (records.length === 0) {
      setError('请先录入至少一条健康数据')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getHealthAdvice({ profile, records: records.slice(0, 30) })
      const saved = storage.saveAIAdvice({ content: result.content })
      const updated = storage.getAIAdvices()
      setAdvices(updated)
      setExpanded(saved.id)
    } catch (err) {
      setError(err.message || '生成失败，请检查网络或 API 配置')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="px-5 py-6 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🤖</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">AI 健康建议</h1>
        <p className="text-sm text-indigo-100">基于你的健康数据生成个性化建议</p>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full text-white py-4 rounded-2xl font-semibold text-base transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              正在生成建议...
            </>
          ) : (
            <>✨ 获取 AI 健康建议</>
          )}
        </button>

        {error && (
          <div className="mt-3 bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3">
            <p className="text-red-600 text-sm font-medium">{error}</p>
            <button
              onClick={handleGenerate}
              className="text-red-500 text-xs mt-2 underline font-medium"
            >
              重试
            </button>
          </div>
        )}
      </div>

      {advices.length > 0 && (
        <div className="px-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">历史建议</h3>
          {advices.map(advice => (
            <div key={advice.id} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => setExpanded(expanded === advice.id ? null : advice.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">健康建议</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(advice.generatedAt), 'yyyy-MM-dd HH:mm')}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 text-lg">{expanded === advice.id ? '▲' : '▼'}</span>
              </button>

              {expanded === advice.id && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-4 font-sans">
                    {advice.content}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {advices.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-5">
            <span className="text-4xl">🤖</span>
          </div>
          <p className="text-gray-500 text-sm font-medium text-center">
            点击上方按钮，获取专属健康建议
          </p>
        </div>
      )}
    </div>
  )
}
