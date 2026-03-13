const KEYS = {
  USER_PROFILE: 'ha_user_profile',
  HEALTH_RECORDS: 'ha_health_records',
  AI_ADVICES: 'ha_ai_advices',
  SETTINGS: 'ha_settings',
}

function safeGet(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch {
    console.warn(`localStorage parse error for key: ${key}`)
    return fallback
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('本地存储空间不足，请导出数据后清理旧记录。')
    }
    return false
  }
}

export const storage = {
  // User Profile
  getUserProfile() {
    return safeGet(KEYS.USER_PROFILE, null)
  },
  saveUserProfile(profile) {
    return safeSet(KEYS.USER_PROFILE, { ...profile, updatedAt: new Date().toISOString() })
  },

  // Health Records
  getHealthRecords() {
    return safeGet(KEYS.HEALTH_RECORDS, [])
  },
  addHealthRecord(record) {
    const records = this.getHealthRecords()
    const newRecord = { ...record, id: Date.now().toString(), createdAt: new Date().toISOString() }
    records.unshift(newRecord)
    safeSet(KEYS.HEALTH_RECORDS, records)
    return newRecord
  },
  updateHealthRecord(id, updates) {
    const records = this.getHealthRecords()
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) return false
    records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() }
    return safeSet(KEYS.HEALTH_RECORDS, records)
  },
  deleteHealthRecord(id) {
    const records = this.getHealthRecords().filter(r => r.id !== id)
    return safeSet(KEYS.HEALTH_RECORDS, records)
  },

  // AI Advices
  getAIAdvices() {
    return safeGet(KEYS.AI_ADVICES, [])
  },
  saveAIAdvice(advice) {
    const advices = this.getAIAdvices()
    const newAdvice = { ...advice, id: Date.now().toString(), generatedAt: new Date().toISOString() }
    advices.unshift(newAdvice)
    // keep latest 20
    safeSet(KEYS.AI_ADVICES, advices.slice(0, 20))
    return newAdvice
  },

  // Export / Import
  exportData() {
    return {
      userProfile: this.getUserProfile(),
      healthRecords: this.getHealthRecords(),
      aiAdvices: this.getAIAdvices(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }
  },
  importData(data) {
    if (!data || !data.version) throw new Error('无效的数据格式')
    if (data.userProfile) safeSet(KEYS.USER_PROFILE, data.userProfile)
    if (Array.isArray(data.healthRecords)) safeSet(KEYS.HEALTH_RECORDS, data.healthRecords)
    if (Array.isArray(data.aiAdvices)) safeSet(KEYS.AI_ADVICES, data.aiAdvices)
  },

  // Reset
  resetAllData() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  },
}
