<script setup lang="ts">
import type { AttachmentCouplesReport } from '~~/shared/attachment/couples-report'

const props = withDefaults(
  defineProps<{
    report: AttachmentCouplesReport
    profileLabels?: [string, string]
  }>(),
  {
    profileLabels: () => ['Profile A', 'Profile B'],
  },
)

const panelShellClass = 'rounded-3xl border border-border p-6'
const sectionTitleClass = 'mb-4 font-display text-[1.75rem] leading-tight font-medium tracking-tight text-dark'
const bodyCopyClass = 'text-[15px] leading-7 text-body'
const noteKickerClass = 'mb-2.5 text-xs font-medium uppercase tracking-widest text-terra'

const resolvedProfileLabels = computed<[string, string]>(() => [
  props.profileLabels[0] ?? 'Profile A',
  props.profileLabels[1] ?? 'Profile B',
])
</script>

<template>
  <div class="grid gap-5">
    <div class="grid gap-5 lg:grid-cols-3">
      <section :class="[panelShellClass, 'bg-white']">
        <p :class="noteKickerClass">Likely friction</p>
        <h2 :class="sectionTitleClass">Where this pair gets stuck</h2>
        <p :class="bodyCopyClass">
          {{ report.frictionSummary }}
        </p>
      </section>

      <section :class="[panelShellClass, 'bg-white']">
        <p :class="noteKickerClass">Built-in strength</p>
        <h2 :class="sectionTitleClass">What can stabilize it</h2>
        <p :class="bodyCopyClass">
          {{ report.strengthSummary }}
        </p>
      </section>

      <section :class="[panelShellClass, 'bg-white']">
        <p :class="noteKickerClass">Best repair move</p>
        <h2 :class="sectionTitleClass">What to do earlier</h2>
        <p :class="bodyCopyClass">
          {{ report.repairSummary }}
        </p>
      </section>
    </div>

    <section :class="[panelShellClass, 'bg-white']">
      <p :class="noteKickerClass">Activation map</p>
      <h2 :class="sectionTitleClass">What activates both systems fastest</h2>
      <p :class="bodyCopyClass">
        {{ report.triggerSummary }}
      </p>

      <div v-if="report.sharedThemes.length" class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="theme in report.sharedThemes"
          :key="theme"
          class="rounded-full border border-border bg-sec-bg px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-dark2"
        >
          {{ theme }}
        </span>
      </div>
    </section>

    <div class="grid gap-5 xl:grid-cols-2">
      <section
        v-for="(profile, index) in report.profiles"
        :key="`${resolvedProfileLabels[index] ?? 'Profile'}-${profile.type}`"
        :class="[panelShellClass, 'bg-white flex flex-col']"
      >
        <p :class="noteKickerClass">{{ resolvedProfileLabels[index] }}</p>

        <div
          class="rounded-3xl border p-5"
          :class="[profile.borderClass, profile.surfaceClass]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-4xl leading-tight font-medium tracking-tight text-dark">
                {{ profile.label }}
              </h2>
              <p class="mt-2 text-sm text-dark2">{{ profile.subprofileLabel }}</p>
            </div>

            <span
              class="rounded-full px-3 py-1 text-center text-xs font-medium"
              :class="profile.badgeClass"
            >
              {{ profile.eyebrow }}
            </span>
          </div>

          <p class="mt-5 text-[15px] leading-7 text-dark2">
            {{ profile.subprofileSummary }}
          </p>
        </div>

        <div class="mt-6 mb-auto grid gap-5 md:grid-cols-2">
          <div>
            <p class="mb-3 text-xs font-medium uppercase tracking-widest text-pale">
              Feels safer with
            </p>
            <ul class="grid gap-3">
              <li v-for="item in profile.relationshipNeeds" :key="item" class="text-sm leading-6 text-dark2">
                {{ item }}
              </li>
            </ul>
          </div>

          <div>
            <p class="mb-3 text-xs font-medium uppercase tracking-widest text-pale">
              Top triggers
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="trigger in profile.strongestTriggers"
                :key="trigger"
                class="rounded-full border border-border bg-sec-bg px-3 py-1.5 text-xs font-medium text-dark2"
              >
                {{ trigger }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-border bg-sec-bg px-4 py-4">
          <p class="mb-2 text-xs font-medium uppercase tracking-widest text-pale">
            Best next step
          </p>
          <p class="text-sm leading-6 text-dark2">
            {{ profile.firstNextStep }}
          </p>
        </div>
      </section>
    </div>

    <section :class="[panelShellClass, 'bg-sec-bg']">
      <p :class="noteKickerClass">Next moves</p>
      <h2 :class="sectionTitleClass">What makes this dynamic more secure</h2>
      <ul class="grid gap-4">
        <li v-for="move in report.repairMoves" :key="move">
          <div class="flex items-start gap-3">
            <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
            <span class="text-[15px] leading-7 text-dark2">{{ move }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
