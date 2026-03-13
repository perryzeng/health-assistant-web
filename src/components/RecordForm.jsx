import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { validateHealthRecord, calculateBMI } from '../utils/calculations'
import { format } from 'date-fns'

export default function RecordForm({ editRecord, onSave, onCancel }) {
  const [form, setForm] = useState({
    weight: '',
    bodyFatRate: '',
    recordDate: format(new Date(), 'yyyy-MM-dd'),
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (editRecord) {
      setForm({
        weight: editRecord.weight,
        bodyFatRate: editRecord.bodyFatRate || '',
        recordDate: editRecord.recordDate,
        note: editRecord.note || '',
      })
    }
  }, [editRecord])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const data = {
      weight: Number(form.weight),
      bodyFatRate: form.bodyFatRate ? Number(form.bodyFatRate) : null,
      recordDate: form.recordDate,
      note: form.note,
    }
    const errs = validateHealthRecord(data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const profile = storage.getUserProfile()
    if (!profile) {
      alert('请先设置个人档案')
      return
    }

    data.bmi = calculateBMI(data.weight, profile.height)

    if (editRecord) {
      storage.updateHealthRecord(editRecord.id, data)
    } else {
      storage.addHealthRecord(data)
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onSave && onSave()
      if (!editRecord) {
        setForm({ weight: '', bodyFatRate: '', recordDate: format(new Date(), 'yyyy-MM-dd'), note: '' })
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">
          {editRecord ? '编辑记录' : '记录数据'}
        </h1>
        {editRecord && (
          <button onClick={onCancel} className="text-sm text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-100">
            取消
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* 体重 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">体重 *</label>
          <div className="relative">
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="65.5"
              step="0.1"
              className={`w-full border rounded-2xl px-5 py-4 text-base font-medium focus:outline-none transition-all ${errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
            />
            <span className="absolute right-5 top-4 text-base text-gray-400 font-medium">kg</span>
          </div>
          {errors.weight && <p className="text-red-500 text-xs mt-2 ml-1">{errors.weight}</p>}
        </div>

        {/* 体脂率 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">体脂率（可选）</label>
          <div className="relative">
            <input
              type="number"
              name="bodyFatRate"
              value={form.bodyFatRate}
              onChange={handleChange}
              placeholder="18.5"
              step="0.1"
              className={`w-full border rounded-2xl px-5 py-4 text-base font-medium focus:outline-none transition-all ${errors.bodyFatRate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
            />
            <span className="absolute right-5 top-4 text-base text-gray-400 font-medium">%</span>
          </div>
          {errors.bodyFatRate && <p className="text-red-500 text-xs mt-2 ml-1">{errors.bodyFatRate}</p>}
        </div>

        {/* 日期 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">记录日期 *</label>
          <input
            type="date"
            name="recordDate"
            value={form.recordDate}
            onChange={handleChange}
            className={`w-full border rounded-2xl px-5 py-4 text-base font-medium focus:outline-none transition-all ${errors.recordDate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
          />
          {errors.recordDate && <p className="text-red-500 text-xs mt-2 ml-1">{errors.recordDate}</p>}
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">备注</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="今天的感受..."
            rows="3"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 resize-none transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full text-white py-4 rounded-2xl font-semibold text-base mt-6 transition-all shadow-lg"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {editRecord ? '保存修改' : '保存记录'}
        </button>
      </form>

      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50">
          <span className="text-lg">✓</span>
          <span className="font-medium">保存成功</span>
        </div>
      )}
    </div>
  )
}
