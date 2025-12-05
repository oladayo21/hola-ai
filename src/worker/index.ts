import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ============================================================================
// Types
// ============================================================================

export interface Env {
  POLLS: KVNamespace;
  ASSETS: Fetcher;
}

interface PollData {
  options: Record<string, number>;
  voters: Record<string, { name: string; option: string }>;
}

interface Question {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  upvotes: number;
  upvotedBy: string[];
  answered?: boolean;
}

interface QuestionsData {
  questions: Question[];
}

interface FreeTextResponse {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  timestamp: number;
}

interface FreeTextData {
  responses: FreeTextResponse[];
}

// ============================================================================
// App Setup
// ============================================================================

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/api/*', cors())

// ============================================================================
// Poll Routes
// ============================================================================

// GET /api/poll/:pollId - Get poll results
app.get('/api/poll/:pollId', async (c) => {
  const pollId = c.req.param('pollId')
  const data = await c.env.POLLS.get<PollData>(`poll:${pollId}`, 'json')

  return c.json(data || { options: {}, voters: {} })
})

// POST /api/poll/:pollId/vote - Submit or change a vote
app.post('/api/poll/:pollId/vote', async (c) => {
  const pollId = c.req.param('pollId')
  const body = await c.req.json<{
    option: string;
    voterId: string;
    voterName?: string;
  }>()

  const { option, voterId, voterName } = body

  if (!option || !voterId) {
    return c.json({ error: 'Missing option or voterId' }, 400)
  }

  const key = `poll:${pollId}`
  const current = await c.env.POLLS.get<PollData>(key, 'json') || {
    options: {},
    voters: {},
  }

  // Check if changing vote
  const previousVoter = current.voters[voterId]

  if (previousVoter) {
    current.options[previousVoter.option] = Math.max(
      0,
      (current.options[previousVoter.option] || 0) - 1
    )
  }

  // Increment new option
  current.options[option] = (current.options[option] || 0) + 1

  // Store voter with name
  current.voters[voterId] = {
    name: voterName || 'Anonym',
    option,
  }

  await c.env.POLLS.put(key, JSON.stringify(current))

  return c.json({ ...current, myVote: option })
})

// POST /api/poll/:pollId/reset - Reset poll
app.post('/api/poll/:pollId/reset', async (c) => {
  const pollId = c.req.param('pollId')
  await c.env.POLLS.put(`poll:${pollId}`, JSON.stringify({ options: {}, voters: {} }))

  return c.json({ success: true, message: 'Poll reset' })
})

// ============================================================================
// Questions Routes
// ============================================================================

// GET /api/questions/:sessionId - Get all questions
app.get('/api/questions/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId')
  const data = await c.env.POLLS.get<QuestionsData>(`questions:${sessionId}`, 'json')

  return c.json(data || { questions: [] })
})

// POST /api/questions/:sessionId - Submit a question
app.post('/api/questions/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId')
  const body = await c.req.json<{
    text: string;
    authorId: string;
    authorName: string;
  }>()

  const { text, authorId, authorName } = body

  if (!text || !authorId || !authorName) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const key = `questions:${sessionId}`
  const current = await c.env.POLLS.get<QuestionsData>(key, 'json') || { questions: [] }

  // Prevent duplicates
  const exists = current.questions.some(
    q => q.authorId === authorId && q.text === text
  )

  if (!exists) {
    current.questions.push({
      id: crypto.randomUUID(),
      text,
      authorId,
      authorName,
      timestamp: Date.now(),
      upvotes: 0,
      upvotedBy: [],
    })
  }

  await c.env.POLLS.put(key, JSON.stringify(current))

  return c.json(current)
})

// POST /api/questions/:sessionId/:questionId/upvote - Upvote a question
app.post('/api/questions/:sessionId/:questionId/upvote', async (c) => {
  const { sessionId, questionId } = c.req.param()
  const body = await c.req.json<{ voterId: string }>()

  if (!body.voterId) {
    return c.json({ error: 'Missing voterId' }, 400)
  }

  const key = `questions:${sessionId}`
  const current = await c.env.POLLS.get<QuestionsData>(key, 'json') || { questions: [] }
  const question = current.questions.find(q => q.id === questionId)

  if (question) {
    const upvoteIndex = question.upvotedBy.indexOf(body.voterId)

    if (upvoteIndex === -1) {
      question.upvotedBy.push(body.voterId)
      question.upvotes++
    } else {
      // Toggle off
      question.upvotedBy.splice(upvoteIndex, 1)
      question.upvotes = Math.max(0, question.upvotes - 1)
    }

    await c.env.POLLS.put(key, JSON.stringify(current))
  }

  return c.json(current)
})

// POST /api/questions/:sessionId/:questionId/answer - Mark as answered
app.post('/api/questions/:sessionId/:questionId/answer', async (c) => {
  const { sessionId, questionId } = c.req.param()
  const key = `questions:${sessionId}`
  const current = await c.env.POLLS.get<QuestionsData>(key, 'json') || { questions: [] }
  const question = current.questions.find(q => q.id === questionId)

  if (question) {
    question.answered = !question.answered
    await c.env.POLLS.put(key, JSON.stringify(current))
  }

  return c.json(current)
})

// DELETE /api/questions/:sessionId/:questionId - Delete a question
app.delete('/api/questions/:sessionId/:questionId', async (c) => {
  const { sessionId, questionId } = c.req.param()
  const key = `questions:${sessionId}`
  const current = await c.env.POLLS.get<QuestionsData>(key, 'json') || { questions: [] }

  current.questions = current.questions.filter(q => q.id !== questionId)
  await c.env.POLLS.put(key, JSON.stringify(current))

  return c.json(current)
})

// ============================================================================
// FreeText Routes
// ============================================================================

// GET /api/freetext/:pollId - Get all responses
app.get('/api/freetext/:pollId', async (c) => {
  const pollId = c.req.param('pollId')
  const data = await c.env.POLLS.get<FreeTextData>(`freetext:${pollId}`, 'json')

  return c.json(data || { responses: [] })
})

// POST /api/freetext/:pollId - Submit or update a response
app.post('/api/freetext/:pollId', async (c) => {
  const pollId = c.req.param('pollId')
  const body = await c.req.json<{
    text: string;
    authorId: string;
    authorName: string;
  }>()

  const { text, authorId, authorName } = body

  if (!text || !authorId || !authorName) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const key = `freetext:${pollId}`
  const current = await c.env.POLLS.get<FreeTextData>(key, 'json') || { responses: [] }
  const existingIndex = current.responses.findIndex(r => r.authorId === authorId)

  const newResponse: FreeTextResponse = {
    id: existingIndex >= 0 ? current.responses[existingIndex].id : crypto.randomUUID(),
    text,
    authorId,
    authorName,
    timestamp: Date.now(),
  }

  if (existingIndex >= 0) {
    current.responses[existingIndex] = newResponse
  } else {
    current.responses.push(newResponse)
  }

  await c.env.POLLS.put(key, JSON.stringify(current))

  return c.json(current)
})

// POST /api/freetext/:pollId/reset - Reset responses
app.post('/api/freetext/:pollId/reset', async (c) => {
  const pollId = c.req.param('pollId')
  await c.env.POLLS.put(`freetext:${pollId}`, JSON.stringify({ responses: [] }))

  return c.json({ success: true, message: 'FreeText reset' })
})

// ============================================================================
// Static Assets Fallback
// ============================================================================

app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw)
})

export default app
