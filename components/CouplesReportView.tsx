import BulletList from '@/components/BulletList'
import type { AttachmentCouplesReport } from '@/shared/attachment/couples-report'

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'

type CouplesReportViewProps = {
  report: AttachmentCouplesReport
  profileLabels?: [string, string]
}

export default function CouplesReportView({ report, profileLabels = ['Profile A', 'Profile B'] }: CouplesReportViewProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <section className={`${panelShellClass} bg-white`}>
          <p className={noteKickerClass}>Likely friction</p>
          <h2 className={sectionTitleClass}>Where this pair gets stuck</h2>
          <p className={bodyCopyClass}>
            {report.frictionSummary}
          </p>
        </section>

        <section className={`${panelShellClass} bg-white`}>
          <p className={noteKickerClass}>Built-in strength</p>
          <h2 className={sectionTitleClass}>What can stabilize it</h2>
          <p className={bodyCopyClass}>
            {report.strengthSummary}
          </p>
        </section>

        <section className={`${panelShellClass} bg-white`}>
          <p className={noteKickerClass}>Best repair move</p>
          <h2 className={sectionTitleClass}>What to do earlier</h2>
          <p className={bodyCopyClass}>
            {report.repairSummary}
          </p>
        </section>
      </div>

      <section className={`${panelShellClass} bg-white`}>
        <p className={noteKickerClass}>Activation map</p>
        <h2 className={sectionTitleClass}>What activates both systems fastest</h2>
        <p className={bodyCopyClass}>
          {report.triggerSummary}
        </p>

        {report.sharedThemes.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {report.sharedThemes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-border bg-sec-bg px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-dark2"
              >
                {theme}
              </span>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        {report.profiles.map((profile, index) => (
          <section key={`${profileLabels[index] ?? 'Profile'}-${profile.type}`} className={`${panelShellClass} bg-white flex flex-col`}>
            <p className={noteKickerClass}>{profileLabels[index]}</p>

            <div className={`rounded-3xl border p-5 ${profile.borderClass} ${profile.surfaceClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-dark">
                    {profile.label}
                  </h2>
                  <p className="mt-2 text-sm text-dark2">{profile.subprofileLabel}</p>
                </div>

                <span className={`rounded-full px-3 py-1 text-center text-xs font-medium ${profile.badgeClass}`}>
                  {profile.eyebrow}
                </span>
              </div>

              <p className="mt-5 text-[15px] leading-7 text-dark2">
                {profile.subprofileSummary}
              </p>
            </div>

            <div className="mt-6 mb-auto grid gap-5 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-pale">
                  Feels safer with
                </p>
                <ul className="grid gap-3">
                  {profile.relationshipNeeds.map((item) => (
                    <li key={item} className="text-sm leading-6 text-dark2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-pale">
                  Top triggers
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.strongestTriggers.map((trigger) => (
                    <span
                      key={trigger}
                      className="rounded-full border border-border bg-sec-bg px-3 py-1.5 text-xs font-medium text-dark2"
                    >
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-sec-bg px-4 py-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-pale">
                Best next step
              </p>
              <p className="text-sm leading-6 text-dark2">
                {profile.firstNextStep}
              </p>
            </div>
          </section>
        ))}
      </div>

      <section className={`${panelShellClass} bg-sec-bg`}>
        <p className={noteKickerClass}>Next moves</p>
        <h2 className={sectionTitleClass}>What makes this dynamic more secure</h2>
        <BulletList items={report.repairMoves} className="grid gap-4" />
      </section>
    </div>
  )
}
