import PDFDocument from 'pdfkit'
import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'
import type { AttachmentReportOrderRecord } from '~~/shared/attachment/report-order'
import type { AttachmentStyleType } from '~~/app/data/tests/attachment'

type StyleReportGuide = {
  corePattern: string
  protectiveHabits: string[]
  secureBehaviors: string[]
  repairScripts: string[]
  sevenDayPractice: string[]
  reflectionPrompts: string[]
}

const colors = {
  cream: '#FAF8F4',
  dark: '#1C1712',
  dark2: '#3A3530',
  body: '#6A645C',
  muted: '#8A847C',
  border: '#E4DDD3',
  terra: '#B85C38',
  terraSoft: '#D4856A',
  secure: '#3A6B4A',
  anxious: '#8B3A47',
  avoidant: '#3A4473',
  fearful: '#7A4E38',
}

const styleColors: Record<AttachmentStyleType, string> = {
  secure: colors.secure,
  anxious: colors.anxious,
  avoidant: colors.avoidant,
  'fearful-avoidant': colors.fearful,
}

const styleReportGuides: Record<AttachmentStyleType, StyleReportGuide> = {
  secure: {
    corePattern:
      'Your system can usually keep closeness and independence in the same room. The paid report focuses on preserving that steadiness under pressure, especially when you are paired with someone less regulated.',
    protectiveHabits: [
      'Carrying too much emotional labor because you believe repair is possible.',
      'Waiting too long to name imbalance because you can tolerate discomfort.',
      'Over-explaining steadiness to someone who needs clearer boundaries from you.',
    ],
    secureBehaviors: [
      'Ask for mutual effort before resentment becomes the only signal.',
      'Let boundaries be part of care, not evidence that care has disappeared.',
      'Choose repair with people who can participate in repair.',
    ],
    repairScripts: [
      'I want to stay connected, and I also need this to be more mutual.',
      'I can talk about this calmly, but I do not want to keep carrying it silently.',
      'Here is what I can offer, and here is what I need from you.',
    ],
    sevenDayPractice: [
      'Notice where you smooth things over too quickly.',
      'Name one small need before it becomes a large frustration.',
      'Ask whether the other person can meet you in repair.',
      'Take one pause before defaulting to patience.',
      'Choose one boundary that protects warmth.',
      'Reflect on where steadiness became over-functioning.',
      'Write one sentence about what secure love should feel like for you now.',
    ],
    reflectionPrompts: [
      'Where do I confuse being steady with being endlessly available?',
      'What would change if my boundaries were treated as part of intimacy?',
      'Which relationships meet my security with security?',
    ],
  },
  anxious: {
    corePattern:
      'Your system seeks connection quickly when uncertainty rises. The paid report helps separate real relational information from alarm, so reassurance can become clearer and less urgent.',
    protectiveHabits: [
      'Scanning silence, timing, or tone for hidden signs of rejection.',
      'Testing for care when asking plainly feels too exposed.',
      'Using repeated reassurance to calm a moment without addressing the deeper fear.',
    ],
    secureBehaviors: [
      'Ask directly for the reassurance you need, once and with specifics.',
      'Pause the spiral before treating uncertainty as evidence.',
      'Build self-trust alongside relational trust.',
    ],
    repairScripts: [
      'I am feeling activated by the distance. Can you reassure me directly?',
      'I do not want to test you. I want to ask plainly for what would help.',
      'Can we agree when we will come back to this so I am not filling in the blanks?',
    ],
    sevenDayPractice: [
      'Notice the first body cue that says distance feels dangerous.',
      'Write the story your mind is telling and the facts you actually have.',
      'Make one direct reassurance ask without adding a test.',
      'Wait ten minutes before sending a second message.',
      'Do one grounding action that does not involve the other person.',
      'Name one need without apologizing for having it.',
      'Record what helped your system settle without chasing certainty.',
    ],
    reflectionPrompts: [
      'What kind of consistency actually helps me feel safe?',
      'When do I ask for reassurance, and when do I test for it?',
      'What would self-trust look like before another person responds?',
    ],
  },
  avoidant: {
    corePattern:
      'Your system protects itself through autonomy, control, or distance when closeness feels demanding. The paid report turns that protection into a more conscious choice instead of an automatic exit.',
    protectiveHabits: [
      'Minimizing needs so nobody can use them against you.',
      'Creating space without explaining what the space means.',
      'Downshifting emotion so quickly that partners cannot find you in the moment.',
    ],
    secureBehaviors: [
      'Name space before it becomes disappearance.',
      'Share one honest feeling earlier than feels natural.',
      'Treat vulnerability as paced information, not total exposure.',
    ],
    repairScripts: [
      'I need some space, and I am not leaving. I can come back at this time.',
      'I am starting to shut down, but I want to stay honest.',
      'The feeling I can name right now is this, even if I do not have the whole answer yet.',
    ],
    sevenDayPractice: [
      'Notice the moment closeness starts to feel like pressure.',
      'Say one small true thing before going quiet.',
      'Ask for a timed pause instead of disappearing.',
      'Let someone support one practical part of your day.',
      'Track where control feels safer than connection.',
      'Stay present for two extra minutes in a vulnerable conversation.',
      'Write one sentence about what autonomy plus closeness could look like.',
    ],
    reflectionPrompts: [
      'What do I fear would happen if someone saw more of my need?',
      'How can I ask for space in a way that still protects connection?',
      'Where has self-reliance become loneliness in better clothing?',
    ],
  },
  'fearful-avoidant': {
    corePattern:
      'Your system can want closeness intensely while bracing against it. The paid report focuses on slowing the push-pull cycle so trust can build through repeated, ordinary safety.',
    protectiveHabits: [
      'Moving toward closeness quickly, then retreating when it becomes real.',
      'Reading vulnerability as danger even when connection is wanted.',
      'Making large relationship decisions while your system is activated.',
    ],
    secureBehaviors: [
      'Slow the pace after intense closeness instead of abruptly changing direction.',
      'Name fear before acting from fear.',
      'Use small follow-through moments as evidence of safety.',
    ],
    repairScripts: [
      'I want closeness, and I am also scared. I need to slow down without disappearing.',
      'Part of me wants to pull away right now. Can we keep this simple and steady?',
      'I do not want fear to make the decision. I need a pause and a clear reconnect time.',
    ],
    sevenDayPractice: [
      'Notice whether urgency or withdrawal is leading the moment.',
      'Name the fear in one sentence before taking action.',
      'Choose one small, steady contact point instead of intensity.',
      'Delay any all-or-nothing decision while activated.',
      'Ask for pacing, not proof.',
      'Track one moment where safety was ordinary and real.',
      'Write one sentence about love that does not require emotional whiplash.',
    ],
    reflectionPrompts: [
      'What signals make closeness feel safe enough to stay with?',
      'When do I mistake intensity for security?',
      'What would slow, repeatable trust look like in my actual relationships?',
    ],
  },
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))

const collectPdfBuffer = (doc: PDFKit.PDFDocument) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on('error', reject)
  })

const drawFooter = (doc: PDFKit.PDFDocument, pageNumber: number) => {
  doc
    .save()
    .strokeColor(colors.border)
    .lineWidth(0.8)
    .moveTo(72, 742)
    .lineTo(540, 742)
    .stroke()
    .font('Helvetica')
    .fontSize(8)
    .fillColor(colors.muted)
    .text('Attachd. Educational report, not diagnosis or therapy.', 72, 752, {
      width: 320,
      lineBreak: false,
    })
    .text(`Page ${pageNumber} of 15`, 420, 752, {
      width: 120,
      align: 'right',
      lineBreak: false,
    })
    .restore()
}

const addPage = (
  doc: PDFKit.PDFDocument,
  pageNumber: number,
  title: string,
  kicker: string = 'Premium PDF report',
) => {
  if (pageNumber > 1) {
    doc.addPage()
  }

  drawFooter(doc, pageNumber)
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(colors.terra)
    .text(kicker.toUpperCase(), 72, 64, {
      characterSpacing: 1.2,
    })
    .font('Times-Roman')
    .fontSize(30)
    .fillColor(colors.dark)
    .text(title, 72, 88, {
      width: 420,
      lineGap: 2,
    })
    .moveDown(0.7)
}

const addParagraph = (doc: PDFKit.PDFDocument, text: string) => {
  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor(colors.body)
    .text(text, {
      width: 468,
      lineGap: 5,
    })
    .moveDown(0.8)
}

const addList = (doc: PDFKit.PDFDocument, items: string[]) => {
  doc
    .font('Helvetica')
    .fontSize(10.5)
    .fillColor(colors.dark2)

  for (const item of items) {
    doc.text(`- ${item}`, {
      width: 452,
      indent: 10,
      lineGap: 4,
    })
    doc.moveDown(0.45)
  }

  doc.moveDown(0.4)
}

const drawStatCard = (
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  label: string,
  value: string,
  accent: string,
) => {
  doc
    .save()
    .roundedRect(x, y, 220, 84, 10)
    .fillAndStroke(colors.cream, colors.border)
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(colors.terra)
    .text(label.toUpperCase(), x + 16, y + 16, {
      width: 188,
      characterSpacing: 0.8,
    })
    .font('Times-Roman')
    .fontSize(21)
    .fillColor(accent)
    .text(value, x + 16, y + 36, {
      width: 188,
      lineGap: 1,
    })
    .restore()
}

const drawBar = (
  doc: PDFKit.PDFDocument,
  y: number,
  label: string,
  percentage: number,
  color: string,
) => {
  const x = 92
  const width = 360
  const filledWidth = Math.max(0, Math.min(width, Math.round((percentage / 100) * width)))

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(colors.dark2)
    .text(label, x, y, {
      width: 250,
      lineBreak: false,
    })
    .font('Helvetica')
    .fillColor(color)
    .text(`${percentage}%`, x + 292, y, {
      width,
      lineBreak: false,
    })
    .roundedRect(x, y + 20, width, 8, 4)
    .fill(colors.border)
    .roundedRect(x, y + 20, filledWidth, 8, 4)
    .fill(color)
}

const addBox = (
  doc: PDFKit.PDFDocument,
  title: string,
  text: string,
  y?: number,
) => {
  const boxY = y ?? doc.y
  doc
    .save()
    .roundedRect(72, boxY, 468, 96, 10)
    .fillAndStroke(colors.cream, colors.border)
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(colors.dark)
    .text(title, 92, boxY + 18, {
      width: 428,
    })
    .font('Helvetica')
    .fontSize(10)
    .fillColor(colors.body)
    .text(text, 92, boxY + 40, {
      width: 428,
      lineGap: 4,
    })
    .restore()

  doc.y = boxY + 116
}

export const generateAttachmentPdfReport = async (
  resultRecord: AttachmentPersistedResultRecord,
  order: AttachmentReportOrderRecord,
) => {
  const doc = new PDFDocument({
    size: 'LETTER',
    margin: 72,
    bufferPages: false,
    info: {
      Title: `${resultRecord.result.content.label} Attachment Report`,
      Author: 'Attachd.',
      Subject: 'Attachment style educational PDF report',
    },
  })
  const bufferPromise = collectPdfBuffer(doc)
  const result = resultRecord.result
  const content = result.content
  const accent = styleColors[result.type]
  const guide = styleReportGuides[result.type]
  const secondaryLabel = result.ranking[1]?.label ?? content.label

  addPage(doc, 1, `${content.label} Attachment Report`, 'Attachd.')
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor(colors.body)
    .text(content.shortSummary, {
      width: 420,
      lineGap: 6,
    })
    .moveDown(1.2)
  drawStatCard(doc, 72, 260, 'Primary style', content.label, accent)
  drawStatCard(doc, 320, 260, 'Subprofile', result.subprofileLabel, accent)
  drawStatCard(doc, 72, 368, 'Top score', `${result.dominantPercentage}%`, accent)
  drawStatCard(doc, 320, 368, 'Report version', order.reportVersion, accent)
  addBox(doc, 'How to use this report', 'Read this as a practical relationship map, not a fixed identity. Your result is a snapshot from one completed quiz and is meant to support reflection, repair, and better conversations.', 498)

  addPage(doc, 2, 'Your Result Snapshot')
  addParagraph(doc, result.subprofileSummary)
  addParagraph(doc, result.stylePairSummary)
  addBox(doc, 'Saved result', `This report was generated from result ${resultRecord.token} on ${formatDate(resultRecord.createdAt)}. The paid download is connected to order ${order.token}.`)
  addBox(doc, 'Score note', result.scoreNote)

  addPage(doc, 3, 'Score Profile')
  addParagraph(doc, 'These bars compare your four attachment style signals inside this quiz. The goal is not to label you forever, but to show which protective strategy had the strongest signal in your answers.')
  result.ranking.forEach((item, index) => {
    drawBar(doc, 220 + index * 76, item.label, item.percentage, styleColors[item.type])
  })
  addBox(doc, 'Primary plus secondary', `Your strongest pattern was ${content.label}. Your second signal was ${secondaryLabel}. Stress can borrow from that second pattern even when the first pattern leads.`, 560)

  addPage(doc, 4, 'Dimension Map')
  addParagraph(doc, 'Dimensions turn the style label into a more useful map. They show which parts of your system are more active around closeness, distance, conflict, and repair.')
  result.dimensions.forEach((dimension, index) => {
    drawBar(doc, 220 + index * 76, dimension.label, dimension.percentage, accent)
  })
  addBox(doc, 'What to notice', 'A high score is not bad by itself. It points to the response that becomes easiest under pressure. Secure growth starts when that response becomes visible before it takes over.', 560)

  addPage(doc, 5, 'Strongest Trigger Clusters')
  addParagraph(doc, 'Your strongest triggers are the situations most likely to activate your attachment strategy quickly. These are the places where small changes can create outsized relief.')
  result.strongestTriggers.forEach((trigger, index) => {
    addBox(doc, `${trigger.label} (${trigger.percentage}%)`, trigger.summary, 210 + index * 122)
  })

  addPage(doc, 6, 'Protective Pattern Map')
  addParagraph(doc, guide.corePattern)
  addParagraph(doc, 'These protective habits are not character flaws. They are strategies your system may use to create safety when closeness, uncertainty, or conflict starts to feel loaded.')
  addList(doc, guide.protectiveHabits)
  addBox(doc, 'The growth edge', 'The work is not to erase protection. The work is to make protection flexible enough that connection has a chance to stay present.')

  addPage(doc, 7, 'Strengths To Keep')
  addParagraph(doc, 'Every attachment pattern has intelligence in it. The goal is to keep the useful part while softening the reflex that creates distance, panic, or confusion.')
  addList(doc, content.strengths)
  addBox(doc, 'Use the strength deliberately', 'Choose one strength that already feels natural. Use it as the starting point for change instead of trying to become a completely different person.')

  addPage(doc, 8, 'Watchouts Under Stress')
  addParagraph(doc, 'Watchouts are the moments where protection can start making the relationship less safe, even if it was trying to prevent pain.')
  addList(doc, content.watchouts)
  addBox(doc, 'Early signal', 'The earlier you notice a watchout, the less force it needs. A small truthful sentence usually works better than a late dramatic repair.')

  addPage(doc, 9, 'Relationship Needs')
  addParagraph(doc, 'These needs are not demands for perfection. They are the conditions that make your system more likely to stay open, honest, and repairable.')
  addList(doc, content.relationshipNeeds)
  addParagraph(doc, 'A need becomes more usable when it is specific, time-bound, and connected to behavior. Instead of asking for someone to be different forever, ask for the next clear action that would help your system settle.')

  addPage(doc, 10, 'Secure Growth Plan')
  addParagraph(doc, 'Secure behavior is usually smaller than people expect. It looks like pausing earlier, naming needs plainly, asking for repair sooner, and letting care include boundaries.')
  addList(doc, guide.secureBehaviors)
  addBox(doc, 'Prepared next steps', result.nextSteps.join(' '))

  addPage(doc, 11, 'Repair Scripts')
  addParagraph(doc, 'Use scripts as scaffolding. The exact words matter less than the structure: name what is happening, name what you need, and give the connection a clear next step.')
  addList(doc, guide.repairScripts)
  addBox(doc, 'A simple repair formula', 'What happened. What I felt. What I need now. When we will reconnect. Keep it short enough to use while activated.')

  addPage(doc, 12, 'Seven-Day Practice')
  addParagraph(doc, 'This is a one-week practice loop. Do not try to overhaul your whole relationship life at once. Look for one small repeatable move each day.')
  addList(doc, guide.sevenDayPractice)

  addPage(doc, 13, 'Reflection Prompts')
  addParagraph(doc, 'Reflection is useful when it stays concrete. Use these prompts after a real interaction, not as abstract self-analysis.')
  addList(doc, guide.reflectionPrompts)
  addBox(doc, 'Keep it practical', 'A useful answer should point to one behavior you can try, one request you can make, or one boundary you can hold.')

  addPage(doc, 14, 'What Secure Can Look Like')
  addParagraph(doc, 'Secure attachment is not constant calm. It is the ability to return to honesty, repair, and choice when the nervous system is under pressure.')
  addList(doc, content.growthMoves)
  addParagraph(doc, 'For your pattern, secure growth especially means making the protective move conscious before it becomes the only move available.')
  addBox(doc, 'Your secure direction', content.reportPromo)

  addPage(doc, 15, 'Educational Disclaimer')
  addParagraph(doc, 'This report is educational and self-reflective. It is not a diagnosis, therapy, medical advice, mental health treatment, or a substitute for professional support.')
  addParagraph(doc, 'Attachment patterns can shift over time and can look different across relationships. Your result reflects how you answered this quiz at one moment in time.')
  addParagraph(doc, 'If relationship stress connects to trauma, abuse, coercion, self-harm, or immediate safety concerns, consider reaching out to a qualified mental health professional, local crisis resource, or trusted support person.')
  addBox(doc, 'Attachd.', 'Use this report as a conversation starter and a practical mirror. You are allowed to grow without turning your result into a permanent identity.')

  doc.end()
  return bufferPromise
}
