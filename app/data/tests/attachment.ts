export const attachmentStyleTypes = [
  'secure',
  'anxious',
  'avoidant',
  'fearful-avoidant',
] as const

export type AttachmentStyleType = typeof attachmentStyleTypes[number]

export type AttachmentAnswerOption = {
  value: number
  label: string
  hint: string
}

export type AttachmentQuestion = {
  id: string
  prompt: string
  note?: string
  weights: Partial<Record<AttachmentStyleType, number>>
}

export type AttachmentTestDefinition = {
  slug: 'attachment'
  title: string
  eyebrow: string
  description: string
  estimatedMinutes: number
  questions: AttachmentQuestion[]
  options: AttachmentAnswerOption[]
}

export const attachmentAnswerOptions: AttachmentAnswerOption[] = [
  {
    value: 0,
    label: 'Not like me',
    hint: 'Almost never true',
  },
  {
    value: 1,
    label: 'Rarely like me',
    hint: 'Sometimes, but not often',
  },
  {
    value: 2,
    label: 'Somewhat like me',
    hint: 'Depends on the moment',
  },
  {
    value: 3,
    label: 'Mostly like me',
    hint: 'Usually true for me',
  },
  {
    value: 4,
    label: 'Very like me',
    hint: 'This is strongly true',
  },
]

export const attachmentTest: AttachmentTestDefinition = {
  slug: 'attachment',
  title: 'Attachment Style Test',
  eyebrow: '25 quick questions',
  description:
    'Answer based on how you usually behave in close relationships, especially when closeness, distance, conflict, or reassurance are involved.',
  estimatedMinutes: 4,
  options: attachmentAnswerOptions,
  questions: [
    {
      id: 'q01',
      prompt: 'When someone I care about seems distant, I start to worry the relationship may be changing.',
      weights: {
        anxious: 1,
        'fearful-avoidant': 0.35,
      },
    },
    {
      id: 'q02',
      prompt: 'I need frequent reassurance that the relationship is okay.',
      weights: {
        anxious: 1,
      },
    },
    {
      id: 'q03',
      prompt: 'After conflict, I keep replaying what happened and worry I may be rejected.',
      weights: {
        anxious: 0.95,
        'fearful-avoidant': 0.45,
      },
    },
    {
      id: 'q04',
      prompt: 'When I do not hear back from someone I care about, I quickly assume something is wrong.',
      weights: {
        anxious: 0.9,
      },
    },
    {
      id: 'q05',
      prompt: 'Conflict makes me fear the relationship itself may be at risk.',
      weights: {
        anxious: 1,
        'fearful-avoidant': 0.4,
      },
    },
    {
      id: 'q06',
      prompt: 'When emotional closeness becomes intense, I want more space.',
      weights: {
        avoidant: 1,
        'fearful-avoidant': 0.35,
      },
    },
    {
      id: 'q07',
      prompt: 'I prefer to handle stress on my own rather than rely on a partner.',
      weights: {
        avoidant: 1,
      },
    },
    {
      id: 'q08',
      prompt: 'I feel uncomfortable when a partner depends heavily on me for emotional support.',
      weights: {
        avoidant: 0.9,
      },
    },
    {
      id: 'q09',
      prompt: 'After strong intimacy, I often need distance to feel settled again.',
      weights: {
        avoidant: 1,
      },
    },
    {
      id: 'q10',
      prompt: 'I keep my feelings contained so I can stay in control.',
      weights: {
        avoidant: 0.95,
      },
    },
    {
      id: 'q11',
      prompt: 'I want close connection, but I get scared when it starts to feel emotionally real.',
      weights: {
        'fearful-avoidant': 1,
        anxious: 0.35,
      },
    },
    {
      id: 'q12',
      prompt: 'Even when I want support, opening up can feel unsafe.',
      weights: {
        'fearful-avoidant': 0.95,
        anxious: 0.3,
      },
    },
    {
      id: 'q13',
      prompt: 'I can swing between wanting reassurance and wanting to withdraw.',
      weights: {
        'fearful-avoidant': 1,
        anxious: 0.45,
        avoidant: 0.45,
      },
    },
    {
      id: 'q14',
      prompt: 'Being deeply known by someone can feel both comforting and risky.',
      weights: {
        'fearful-avoidant': 0.95,
      },
    },
    {
      id: 'q15',
      prompt: 'I expect closeness to end in hurt or disappointment.',
      weights: {
        'fearful-avoidant': 1,
        anxious: 0.4,
      },
    },
    {
      id: 'q16',
      prompt: 'I can usually say what I need without shutting down or escalating.',
      weights: {
        secure: 1,
      },
    },
    {
      id: 'q17',
      prompt: 'Even when I feel hurt, I can stay connected enough to repair after conflict.',
      weights: {
        secure: 1,
      },
    },
    {
      id: 'q18',
      prompt: 'I am comfortable with both closeness and independence in relationships.',
      weights: {
        secure: 1,
      },
    },
    {
      id: 'q19',
      prompt: 'After relationship tension, I usually recover without staying stuck for long.',
      weights: {
        secure: 0.9,
      },
    },
    {
      id: 'q20',
      prompt: 'Once trust is built, I do not automatically assume the other person will leave or let me down.',
      weights: {
        secure: 1,
      },
    },
    {
      id: 'q21',
      prompt: 'When someone needs space, I can usually respect it without panicking or pushing back.',
      weights: {
        secure: 0.9,
      },
    },
    {
      id: 'q22',
      prompt: 'I can accept support without feeling weak, trapped, or overly exposed.',
      weights: {
        secure: 0.9,
      },
    },
    {
      id: 'q23',
      prompt: 'I sometimes test whether someone cares before I fully trust the relationship.',
      weights: {
        anxious: 0.8,
        'fearful-avoidant': 0.35,
      },
    },
    {
      id: 'q24',
      prompt: 'When a relationship becomes very serious, part of me wants more distance.',
      weights: {
        avoidant: 0.85,
        'fearful-avoidant': 0.4,
      },
    },
    {
      id: 'q25',
      prompt: 'I can imagine deep love, but I do not fully trust it to remain safe.',
      weights: {
        'fearful-avoidant': 0.8,
        anxious: 0.45,
      },
    },
  ],
}

export const isAttachmentStyleType = (value: string): value is AttachmentStyleType =>
  attachmentStyleTypes.includes(value as AttachmentStyleType)
