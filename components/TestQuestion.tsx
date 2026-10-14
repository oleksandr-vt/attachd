import type { AttachmentAnswerOption, AttachmentQuestion } from '@/lib/data/tests/attachment'

type TestQuestionProps = {
  question: AttachmentQuestion
  questionNumber: number
  totalQuestions: number
  selectedValue: number | null
  options: AttachmentAnswerOption[]
  onSelect: (value: number) => void
}

export default function TestQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedValue,
  options,
  onSelect,
}: TestQuestionProps) {
  return (
    <article className="rounded-3xl border border-border bg-white p-7 shadow-report-card sm:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-140">
          <p className="mb-2.5 text-xs font-medium uppercase tracking-widest text-terra">
            {`Question ${questionNumber} of ${totalQuestions}`}
          </p>
          <h2 className="font-display text-[1.7rem] leading-[1.14] font-medium tracking-tight text-dark sm:text-[2.15rem] lg:text-[2.35rem]">
            {question.prompt}
          </h2>
        </div>

        <span className="rounded-full border border-border bg-sec-bg px-3.5 py-2 text-xs text-muted">
          Choose what feels most true on average
        </span>
      </div>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`flex w-full items-center gap-4 rounded-2xl border px-4.5 py-4 text-left transition-all duration-200 ${selectedValue === option.value
              ? 'border-soft-muted bg-sec-bg shadow-[0_10px_24px_rgba(28,23,18,0.06)]'
              : 'border-border bg-cream hover:-translate-y-px hover:border-[#d9cfc3]'}`}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(option.value)
            }}
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/80 text-[13px] font-medium text-dark">
              {option.value + 1}
            </span>

            <span className="min-w-0 flex-1">
              <span className="mb-0.5 block text-[15px] font-medium text-dark">{option.label}</span>
              <span className="block text-[13px] text-muted">{option.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </article>
  )
}
