import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { attachmentTest, isAttachmentStyleType, type AttachmentQuestion, type AttachmentStyleType } from '@/lib/data/tests/attachment'
import {
  computeAttachmentResult,
  createEmptyAttachmentAnswers,
  normalizeAttachmentAnswers,
  type AttachmentAnswerMap,
  type AttachmentComputedResult,
  type AttachmentRankingItem,
} from '@/shared/attachment/scoring'

type AttachmentStoredResult = {
  type: AttachmentStyleType
  secondaryType: AttachmentStyleType
  ranking: AttachmentRankingItem[]
}

type AttachmentTestSession = {
  slug: 'attachment'
  currentIndex: number
  answers: AttachmentAnswerMap
  startedAt: string | null
  completedAt: string | null
  lastResultType: AttachmentStyleType | null
  lastComputedResult: AttachmentStoredResult | null
  lastSharedResultToken: string | null
  email: string
}

type TestStoreState = {
  session: AttachmentTestSession
  storageHydrated: boolean
}

const STORAGE_KEY = 'attachd:attachment-test'
const firstQuestion = attachmentTest.questions[0]
const totalQuestions = attachmentTest.questions.length

if (!firstQuestion) {
  throw new Error('Attachment test requires at least one question.')
}

const createDefaultSession = (): AttachmentTestSession => ({
  slug: 'attachment',
  currentIndex: 0,
  answers: createEmptyAttachmentAnswers(),
  startedAt: null,
  completedAt: null,
  lastResultType: null,
  lastComputedResult: null,
  lastSharedResultToken: null,
  email: '',
})

const normalizeStoredRanking = (value: unknown): AttachmentRankingItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const candidate = item as Partial<AttachmentRankingItem>

    if (
      typeof candidate.type !== 'string'
      || !isAttachmentStyleType(candidate.type)
      || typeof candidate.label !== 'string'
      || typeof candidate.score !== 'number'
      || typeof candidate.percentage !== 'number'
      || typeof candidate.accentClass !== 'string'
      || typeof candidate.barClass !== 'string'
    ) {
      return []
    }

    return [{
      type: candidate.type,
      label: candidate.label,
      score: candidate.score,
      percentage: candidate.percentage,
      accentClass: candidate.accentClass,
      barClass: candidate.barClass,
    }]
  })
}

const normalizeStoredResult = (value: unknown): AttachmentStoredResult | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Partial<AttachmentStoredResult>

  if (
    typeof candidate.type !== 'string'
    || !isAttachmentStyleType(candidate.type)
    || typeof candidate.secondaryType !== 'string'
    || !isAttachmentStyleType(candidate.secondaryType)
  ) {
    return null
  }

  return {
    type: candidate.type,
    secondaryType: candidate.secondaryType,
    ranking: normalizeStoredRanking(candidate.ranking),
  }
}

const normalizeSession = (value: unknown): AttachmentTestSession => {
  const baseSession = createDefaultSession()

  if (!value || typeof value !== 'object') {
    return baseSession
  }

  const candidate = value as Partial<AttachmentTestSession>

  return {
    slug: 'attachment',
    currentIndex: typeof candidate.currentIndex === 'number'
      ? Math.min(Math.max(candidate.currentIndex, 0), totalQuestions - 1)
      : 0,
    answers: normalizeAttachmentAnswers(candidate.answers),
    startedAt: typeof candidate.startedAt === 'string' ? candidate.startedAt : null,
    completedAt: typeof candidate.completedAt === 'string' ? candidate.completedAt : null,
    lastResultType: typeof candidate.lastResultType === 'string' && isAttachmentStyleType(candidate.lastResultType)
      ? candidate.lastResultType
      : null,
    lastComputedResult: normalizeStoredResult(candidate.lastComputedResult),
    lastSharedResultToken: typeof candidate.lastSharedResultToken === 'string'
      ? candidate.lastSharedResultToken
      : null,
    email: typeof candidate.email === 'string' ? candidate.email : '',
  }
}

const getAnsweredCount = (session: AttachmentTestSession) =>
  attachmentTest.questions.filter((question) => typeof session.answers[question.id] === 'number').length

const getFirstUnansweredIndex = (session: AttachmentTestSession) => {
  const unresolvedIndex = attachmentTest.questions.findIndex(
    (question) => session.answers[question.id] === null,
  )

  return unresolvedIndex === -1 ? totalQuestions - 1 : unresolvedIndex
}

const getCurrentIndex = (session: AttachmentTestSession) => Math.min(session.currentIndex, totalQuestions - 1)

const getCurrentQuestion = (session: AttachmentTestSession): AttachmentQuestion =>
  attachmentTest.questions[getCurrentIndex(session)] ?? firstQuestion

const getCurrentAnswer = (session: AttachmentTestSession): number | null =>
  session.answers[getCurrentQuestion(session).id] ?? null

const serverState: TestStoreState = { session: createDefaultSession(), storageHydrated: false }
let state = serverState
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => state
const getServerSnapshot = () => serverState

const writeStoredSession = (session: AttachmentTestSession) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {}
}

const setStoreState = (nextState: TestStoreState, persist: boolean) => {
  state = nextState

  if (persist) {
    writeStoredSession(nextState.session)
  }

  listeners.forEach((listener) => listener())
}

const updateSession = (update: (session: AttachmentTestSession) => AttachmentTestSession) => {
  setStoreState({ ...state, session: update(state.session) }, state.storageHydrated)
}

const hydrateFromStorage = () => {
  if (state.storageHydrated) {
    return
  }

  let savedSession: string | null = null

  try {
    savedSession = window.localStorage.getItem(STORAGE_KEY)
  } catch {}

  if (!savedSession) {
    setStoreState({ ...state, storageHydrated: true }, false)
    return
  }

  let session: AttachmentTestSession

  try {
    session = normalizeSession(JSON.parse(savedSession))
  } catch {
    session = createDefaultSession()
  }

  setStoreState({ session, storageHydrated: true }, true)
}

const resetTest = () => {
  updateSession((session) => ({
    ...createDefaultSession(),
    email: session.email,
  }))
}

const startTest = (forceRestart: boolean = false) => {
  if (forceRestart) {
    resetTest()
  }

  updateSession((session) => ({
    ...session,
    startedAt: session.startedAt ?? new Date().toISOString(),
    currentIndex: getFirstUnansweredIndex(session),
  }))
}

const setAnswer = (questionId: string, value: number) => {
  updateSession((session) => ({
    ...session,
    startedAt: session.startedAt ?? new Date().toISOString(),
    answers: { ...session.answers, [questionId]: value },
    completedAt: null,
    lastResultType: null,
    lastComputedResult: null,
    lastSharedResultToken: null,
  }))
}

const goToNextQuestion = () => {
  const currentIndex = getCurrentIndex(state.session)

  if (getCurrentAnswer(state.session) === null || currentIndex >= totalQuestions - 1) {
    return false
  }

  updateSession((session) => ({ ...session, currentIndex: currentIndex + 1 }))
  return true
}

const goToPreviousQuestion = () => {
  updateSession((session) => ({
    ...session,
    currentIndex: Math.max(getCurrentIndex(session) - 1, 0),
  }))
}

const completeTest = () => {
  if (getAnsweredCount(state.session) !== totalQuestions) {
    return null
  }

  const result = computeAttachmentResult(state.session.answers)

  updateSession((session) => ({
    ...session,
    completedAt: new Date().toISOString(),
    lastResultType: result.type,
    lastComputedResult: {
      type: result.type,
      secondaryType: result.secondaryType,
      ranking: result.ranking,
    },
    currentIndex: totalQuestions - 1,
  }))

  return result
}

const rememberEmail = (email: string) => {
  updateSession((session) => ({ ...session, email: email.trim() }))
}

const setSharedResultToken = (token: string) => {
  updateSession((session) => ({ ...session, lastSharedResultToken: token }))
}

export const useTest = () => {
  const { session, storageHydrated } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    hydrateFromStorage()
  }, [])

  const answeredCount = getAnsweredCount(session)
  const isComplete = answeredCount === totalQuestions
  const currentIndex = getCurrentIndex(session)
  const remainingQuestions = totalQuestions - answeredCount

  const computedResult = useMemo<AttachmentComputedResult | null>(
    () => (isComplete ? computeAttachmentResult(session.answers) : null),
    [isComplete, session.answers],
  )

  return {
    attachmentTest,
    session,
    storageHydrated,
    totalQuestions,
    answeredCount,
    currentIndex,
    currentQuestion: getCurrentQuestion(session),
    currentAnswer: getCurrentAnswer(session),
    currentQuestionNumber: currentIndex + 1,
    progressPercentage: Math.round((answeredCount / totalQuestions) * 100),
    remainingQuestions,
    estimatedMinutesLeft: Math.max(1, Math.ceil(remainingQuestions / 6)),
    hasStarted: session.startedAt !== null || answeredCount > 0,
    isComplete,
    hasSubmittedResults: session.completedAt !== null,
    computedResult,
    startTest,
    setAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    completeTest,
    rememberEmail,
    setSharedResultToken,
    resetTest,
  }
}
