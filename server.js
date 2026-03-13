import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

const anthropic = new Anthropic({ baseURL:'https://api.aicodemirror.com/api/claudecode',
  apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/advice', async (req, res) => {
  const { userData } = req.body
  if (!userData) return res.status(400).json({ error: '缺少用户数据' })

  const { profile, records } = userData
  if (!profile || !records) return res.status(400).json({ error: '数据格式错误' })

  const latest = records[0]
  const weightChange = records.length >= 2
    ? (records[0].weight - records[records.length - 1].weight).toFixed(1)
    : null

  const prompt = `你是一位专业的健康顾问，请根据以下用户数据给出个性化健康建议。

用户信息：
- 性别：${profile.gender === 'male' ? '男' : '女'}
- 年龄：${profile.age} 岁
- 身高：${profile.height} cm
- 目标体重：${profile.targetWeight} kg

最新数据：
- 当前体重：${latest.weight} kg
- BMI：${latest.bmi}
${latest.bodyFatRate ? `- 体脂率：${latest.bodyFatRate}%` : ''}
${weightChange !== null ? `- 近期体重变化：${weightChange > 0 ? '+' : ''}${weightChange} kg（共 ${records.length} 条记录）` : ''}

请用中文回复，格式如下（严格按照此格式）：

【健康评估】
（2-3句话评估当前健康状态）

【建议】
1. （具体可执行的建议）
2. （具体可执行的建议）
3. （具体可执行的建议）

【今日饮食推荐】
早餐：（具体食物）
午餐：（具体食物）
晚餐：（具体食物）

要求：语气友好鼓励，建议具体可操作，饮食符合中国人习惯，总字数控制在300字内。`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })
    res.json({ success: true, content: message.content[0].text })
  } catch (err) {
    console.error('Claude API error:', err.message)
    res.status(500).json({ error: '生成建议失败，请稍后重试' })
  }
})

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) res.status(500).send('Build not found. Please check Railway build logs.')
  })
})

app.listen(PORT, () => {
  console.log(`Health Assistant API running on http://localhost:${PORT}`)
})
