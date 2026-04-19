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
      prompt: 'When someone I care about feels distant, I quickly worry that something is wrong.',
      weights: {
        anxious: 1,
        'fearful-avoidant': 0.35,
      },
    },
    {
      id: 'q02',
      prompt: 'I need frequent reassurance to feel secure in a relationship.',
      weights: {
        anxious: 1,
      },
    },
    {
      id: 'q03',
      prompt: 'After a tense conversation, I replay it in my head looking for signs I may be rejected.',
      weights: {
        anxious: 0.95,
        'fearful-avoidant': 0.45,
      },
    },
    {
      id: 'q04',
      prompt: 'If a message is not answered quickly, my mind often jumps to the worst-case explanation.',
      weights: {
        anxious: 0.9,
      },
    },
    {
      id: 'q05',
      prompt: 'Conflict makes me fear that the relationship itself may be in danger.',
      weights: {
        anxious: 1,
        'fearful-avoidant': 0.4,
      },
    },
    {
      id: 'q06',
      prompt: 'When emotional closeness feels intense, part of me wants to pull back or create space.',
      weights: {
        avoidant: 1,
        'fearful-avoidant': 0.35,
      },
    },
    {
      id: 'q07',
      prompt: 'I prefer to handle stress on my own rather than lean on a partner.',
      weights: {
        avoidant: 1,
      },
    },
    {
      id: 'q08',
      prompt: 'I feel uncomfortable when someone depends on me too much emotionally.',
      weights: {
        avoidant: 0.9,
      },
    },
    {
      id: 'q09',
      prompt: 'After moments of intimacy, I often need distance to feel like myself again.',
      weights: {
        avoidant: 1,
      },
    },
    {
      id: 'q10',
      prompt: 'I tend to downplay my feelings so I can stay in control.',
      weights: {
        avoidant: 0.95,
      },
    },
    {
      id: 'q11',
      prompt: 'I want deep closeness, but I can get scared when it starts to feel real.',
      weights: {
        'fearful-avoidant': 1,
        anxious: 0.35,
      },
    },
    {
      id: 'q12',
      prompt: 'I can want support and still expect that opening up will get me hurt.',
      weights: {
        'fearful-avoidant': 0.95,
        anxious: 0.3,
      },
    },
    {
      id: 'q13',
      prompt: 'I swing between craving reassurance and wanting to disappear for a while.',
      weights: {
        'fearful-avoidant': 1,
        anxious: 0.45,
        avoidant: 0.45,
      },
    },
    {
      id: 'q14',
      prompt: 'Being fully known by someone can feel both comforting and dangerous.',
      weights: {
        'fearful-avoidant': 0.95,
      },
    },
    {
      id: 'q15',
      prompt: 'Part of me expects that closeness will eventually lead to pain or disappointment.',
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
      prompt: 'I feel comfortable with closeness and independence at the same time.',
      weights: {
        secure: 1,
      },
    },
    {
      id: 'q19',
      prompt: 'After tension in a relationship, I tend to recover fairly quickly instead of staying stuck.',
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
      prompt: 'When someone needs space, I can usually respect it without panicking or retaliating.',
      weights: {
        secure: 0.9,
      },
    },
    {
      id: 'q22',
      prompt: 'I let people support me without feeling weak, trapped, or exposed for doing so.',
      weights: {
        secure: 0.9,
      },
    },
    {
      id: 'q23',
      prompt: 'I sometimes test whether someone really cares before I fully relax.',
      weights: {
        anxious: 0.8,
        'fearful-avoidant': 0.35,
      },
    },
    {
      id: 'q24',
      prompt: 'If a relationship starts to feel very serious, part of me wants an escape route.',
      weights: {
        avoidant: 0.85,
        'fearful-avoidant': 0.4,
      },
    },
    {
      id: 'q25',
      prompt: 'I can imagine deep love, but I do not fully trust that it will stay safe for long.',
      weights: {
        'fearful-avoidant': 0.8,
        anxious: 0.45,
      },
    },
  ],
}

export const isAttachmentStyleType = (value: string): value is AttachmentStyleType =>
  attachmentStyleTypes.includes(value as AttachmentStyleType)

