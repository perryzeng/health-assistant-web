import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { validateProfile } from '../utils/calculations'

export default function ProfileSetup({ onSave, isEdit = false }) {
  const [form, setForm] = useState({
    nickname: '',
    gender: 'male',
    age: '',
    height: '',
    targetWeight: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      const profile = storage.getUserProfile()
      if (profile) setForm(profile)
    }
  }, [isEdit])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const data = {
      ...form,
      age: Number(form.age),
      height: Number(form.height),
      targetWeight: Number(form.targetWeight),
    }
    const errs = validateProfile(data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    storage.saveUserProfile(data)
    onSave && onSave(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-5 py-6 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">👤</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">
          {isEdit ? '编辑档案' : '创建健康档案'}
        </h1>
        {!isEdit && (
          <p className="text-sm text-indigo-100">填写基本信息，开始健康追踪</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* 昵称 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">昵称</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="给自己起个名字"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
          />
        </div>

        {/* 性别 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">性别</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ value: 'male', label: '男', icon: '👨' }, { value: 'female', label: '女', icon: '👩' }].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, gender: opt.value }))}
                className={`py-4 rounded-2xl text-base font-semibold border-2 transition-all ${
                  form.gender === opt.value
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <span className="mr-2">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 年龄 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">年龄</label>
          <div className="relative">
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="18"
              className={`w-full border rounded-2xl px-5 py-4 text-base font-medium focus:outline-none transition-all ${errors.age ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
            />
            <span className="absolute right-5 top-4 text-base text-gray-400 font-medium">岁</span>
          </div>
          {errors.age && <p className="text-red-500 text-xs mt-2 ml-1">{errors.age}</p>}
        </div>

        {/* 身高 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">身高</label>
          <div className="relative">
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="170"
              className={`w-full border rounded-2xl px-5 py-4 text-base font-medium focus:outline-none transition-all ${errors.height ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
            />
            <span className="absolute right-5 top-4 text-base text-gray-400 font-medium">cm</span>
          </div>
          {errors.height && <p className="text-red-500 text-xs mt-2 ml-1">{errors.height}</p>}
        </div>

        {/* 目标体重 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">目标体重</label>
          <div className="relative">
            <input
              type="number"
              name="targetWeight"
              value={form.targetWeight}
              onChange={handleChange}
              placeholder="65"
              step="0.1"
              className={`w-full border rounded-2xl px-5 py-4 text-base font-medium focus:outline-none transition-all ${errors.targetWeight ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
            />
            <span className="absolute right-5 top-4 text-base text-gray-400 font-medium">kg</span>
          </div>
          {errors.targetWeight && <p className="text-red-500 text-xs mt-2 ml-1">{errors.targetWeight}</p>}
        </div>

        <button
          type="submit"
          className="w-full text-white py-4 rounded-2xl font-semibold text-base mt-6 transition-all shadow-lg"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {isEdit ? '保存修改' : '开始使用'}
        </button>
      </form>
    </div>
  )
}
