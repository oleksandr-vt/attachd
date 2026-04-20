import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { AttachmentPersistedResultRecord } from '~~/shared/attachment/persistence'

const resultsDirectory = join(process.cwd(), '.data', 'attachment-results')

const getResultFilePath = (token: string) => join(resultsDirectory, `${token}.json`)

const ensureResultsDirectory = async () => {
  await mkdir(resultsDirectory, { recursive: true })
}

export const getAttachmentResultRecord = async (token: string) => {
  try {
    const file = await readFile(getResultFilePath(token), 'utf8')
    return JSON.parse(file) as AttachmentPersistedResultRecord
  } catch (error) {
    if (
      error
      && typeof error === 'object'
      && 'code' in error
      && error.code === 'ENOENT'
    ) {
      return null
    }

    throw error
  }
}

export const saveAttachmentResultRecord = async (record: AttachmentPersistedResultRecord) => {
  await ensureResultsDirectory()
  await writeFile(
    getResultFilePath(record.token),
    JSON.stringify(record, null, 2),
    'utf8',
  )
}

export const updateAttachmentResultRecord = async (
  token: string,
  updater: (record: AttachmentPersistedResultRecord) => AttachmentPersistedResultRecord,
) => {
  const currentRecord = await getAttachmentResultRecord(token)

  if (!currentRecord) {
    return null
  }

  const nextRecord = updater(currentRecord)
  await saveAttachmentResultRecord(nextRecord)

  return nextRecord
}
