import { attachmentTest, isAttachmentStyleType, type AttachmentQuestion, type AttachmentStyleType } from '~/data/tests/attachment'
import { useResults, type AttachmentAnswerMap, type AttachmentComputedResult, type AttachmentRankingItem } from '~/composables/useResults'
import { createEmptyAttachmentAnswers, normalizeAttachmentAnswers } from '~~/shared/attachment/scoring'

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

const STORAGE_KEY = 'attachd:attachment-test'
const firstQuestion = attachmentTest.questions[0]

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
      ? Math.min(Math.max(candidate.currentIndex, 0), attachmentTest.questions.length - 1)
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

export const useTest = (slug: string = 'attachment') => {
  if (slug !== 'attachment') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Test not found',
    })
  }

  const { getResultFromAnswers } = useResults()
  const session = useState<AttachmentTestSession>('attachment-test-session', createDefaultSession)
  const storageHydrated = useState<boolean>('attachment-test-storage-hydrated', () => false)

  if (import.meta.client) {
    onMounted(() => {
      if (storageHydrated.value) {
        return
      }

      const savedSession = window.localStorage.getItem(STORAGE_KEY)

      if (savedSession) {
        try {
          session.value = normalizeSession(JSON.parse(savedSession))
        } catch {
          session.value = createDefaultSession()
        }
      }

      storageHydrated.value = true
    })

    watch(
      session,
      (value) => {
        if (!storageHydrated.value) {
          return
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      },
      { deep: true },
    )
  }

  const answeredCount = computed(() =>
    attachmentTest.questions.filter((question) => typeof session.value.answers[question.id] === 'number').length,
  )

  const totalQuestions = attachmentTest.questions.length

  const firstUnansweredIndex = computed(() => {
    const unresolvedIndex = attachmentTest.questions.findIndex(
      (question) => session.value.answers[question.id] === null,
    )

    return unresolvedIndex === -1 ? totalQuestions - 1 : unresolvedIndex
  })

  const hasStarted = computed(() =>
    session.value.startedAt !== null || answeredCount.value > 0,
  )

  const isComplete = computed(() => answeredCount.value === totalQuestions)
  const hasSubmittedResults = computed(() => session.value.completedAt !== null)

  const currentIndex = computed(() =>
    Math.min(session.value.currentIndex, totalQuestions - 1),
  )

  const currentQuestion = computed<AttachmentQuestion>(() =>
    attachmentTest.questions[currentIndex.value] ?? firstQuestion,
  )

  const currentAnswer = computed<number | null>(() =>
    session.value.answers[currentQuestion.value.id] ?? null,
  )

  const currentQuestionNumber = computed(() => currentIndex.value + 1)

  const progressPercentage = computed(() =>
    Math.round((answeredCount.value / totalQuestions) * 100),
  )

  const remainingQuestions = computed(() => totalQuestions - answeredCount.value)

  const estimatedMinutesLeft = computed(() =>
    Math.max(1, Math.ceil(remainingQuestions.value / 6)),
  )

  const computedResult = computed<AttachmentComputedResult | null>(() =>
    isComplete.value ? getResultFromAnswers(session.value.answers) : null,
  )

  const startTest = (forceRestart: boolean = false) => {
    if (forceRestart) {
      resetTest()
    }

    if (session.value.startedAt === null) {
      session.value.startedAt = new Date().toISOString()
    }

    session.value.currentIndex = firstUnansweredIndex.value
  }

  const setAnswer = (questionId: string, value: number) => {
    if (session.value.startedAt === null) {
      session.value.startedAt = new Date().toISOString()
    }

    session.value.answers[questionId] = value
    session.value.completedAt = null
    session.value.lastResultType = null
    session.value.lastComputedResult = null
    session.value.lastSharedResultToken = null
  }

  const goToQuestion = (index: number) => {
    session.value.currentIndex = Math.min(Math.max(index, 0), totalQuestions - 1)
  }

  const goToNextQuestion = () => {
    if (currentAnswer.value === null) {
      return false
    }

    if (currentIndex.value < totalQuestions - 1) {
      session.value.currentIndex = currentIndex.value + 1
      return true
    }

    return false
  }

  const goToPreviousQuestion = () => {
    session.value.currentIndex = Math.max(currentIndex.value - 1, 0)
  }

  const completeTest = () => {
    if (!isComplete.value) {
      return null
    }

    const result = getResultFromAnswers(session.value.answers)
    session.value.completedAt = new Date().toISOString()
    session.value.lastResultType = result.type
    session.value.lastComputedResult = {
      type: result.type,
      secondaryType: result.secondaryType,
      ranking: result.ranking,
    }
    session.value.currentIndex = totalQuestions - 1

    return result
  }

  const rememberEmail = (email: string) => {
    session.value.email = email.trim()
  }

  const setSharedResultToken = (token: string) => {
    session.value.lastSharedResultToken = token
  }

  const resetTest = () => {
    const preservedEmail = session.value.email

    session.value = {
      ...createDefaultSession(),
      email: preservedEmail,
    }
  }

  const clearStoredSession = () => {
    if (import.meta.client) {
      window.localStorage.removeItem(STORAGE_KEY)
    }

    session.value = createDefaultSession()
  }

  return {
    attachmentTest,
    session,
    storageHydrated,
    totalQuestions,
    answeredCount,
    currentIndex,
    currentQuestion,
    currentAnswer,
    currentQuestionNumber,
    progressPercentage,
    remainingQuestions,
    estimatedMinutesLeft,
    hasStarted,
    isComplete,
    hasSubmittedResults,
    computedResult,
    startTest,
    setAnswer,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    completeTest,
    rememberEmail,
    setSharedResultToken,
    resetTest,
    clearStoredSession,
  }
}
