export function calculateBMI(weight, height) {
  if (!weight || !height) return null
  const heightM = height / 100
  return (weight / (heightM * heightM)).toFixed(1)
}

export function getBMICategory(bmi) {
  if (!bmi) return { label: '未知', color: 'gray' }
  const val = parseFloat(bmi)
  if (val < 18.5) return { label: '偏轻', color: 'blue' }
  if (val < 24) return { label: '正常', color: 'green' }
  if (val < 28) return { label: '超重', color: 'orange' }
  return { label: '肥胖', color: 'red' }
}

export function calculateWeightChange(records) {
  if (records.length < 2) return null
  const latest = records[0].weight
  const previous = records[1].weight
  return (latest - previous).toFixed(1)
}

export function filterRecordsByDays(records, days) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return records.filter(r => new Date(r.recordDate) >= cutoff)
}

export function validateProfile(data) {
  const errors = {}
  if (!data.height || data.height < 150 || data.height > 220) {
    errors.height = '身高需在 150-220cm 之间'
  }
  if (!data.age || data.age < 10 || data.age > 120) {
    errors.age = '年龄需在 10-120 岁之间'
  }
  if (!data.gender || !['male', 'female'].includes(data.gender)) {
    errors.gender = '请选择性别'
  }
  if (!data.targetWeight || data.targetWeight < 30 || data.targetWeight > 200) {
    errors.targetWeight = '目标体重需在 30-200kg 之间'
  }
  return errors
}

export function validateHealthRecord(data) {
  const errors = {}
  if (!data.weight || data.weight < 30 || data.weight > 200) {
    errors.weight = '体重需在 30-200kg 之间'
  }
  if (data.bodyFatRate && (data.bodyFatRate < 5 || data.bodyFatRate > 50)) {
    errors.bodyFatRate = '体脂率需在 5-50% 之间'
  }
  if (!data.recordDate) {
    errors.recordDate = '请选择记录日期'
  }
  return errors
}
