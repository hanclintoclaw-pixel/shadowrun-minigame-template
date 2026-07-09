const PREFILLED_ISSUE_URL_MAX_LENGTH = 7000

export interface PersistRequest<State> {
  schemaVersion: 'shadowrun-minigame-persist/v1'
  appId: string
  appName: string
  campaign: string
  createdAt: string
  sourceRepository: string
  localStorageKey: string
  authorization: {
    requiredAuthorAssociation: Array<'MEMBER' | 'OWNER' | 'COLLABORATOR'>
    fallback: string
  }
  summary: string
  canonicalTargets: string[]
  requestedChanges: Array<{
    type: string
    payload: State
  }>
}

export function loadLocalState<State>(key: string, fallback: State, isValid: (value: unknown) => value is State): State {
  const stored = window.localStorage.getItem(key)
  if (!stored) return fallback

  const parsed: unknown = JSON.parse(stored)
  if (!isValid(parsed)) {
    throw new Error(`Stored state for ${key} does not match the expected schema.`)
  }
  return parsed
}

export function saveLocalState<State>(key: string, state: State) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

export function snapshotOf(value: unknown) {
  return JSON.stringify(value)
}

export interface PersistIssueDraft {
  url: string
  attachment?: {
    filename: string
    content: string
  }
}

export function buildIssueBody<State>(request: PersistRequest<State>) {
  return `## Human summary

${request.summary}

## Permission gate

Maintainers/Cindy: do not apply this request unless the issue author's GitHub association is MEMBER, OWNER, or COLLABORATOR, or a repo member explicitly approves it in-thread.

## Machine-readable request

\`\`\`json
${JSON.stringify(request, null, 2)}
\`\`\`
`
}

export function buildAttachmentIssueBody<State>(request: PersistRequest<State>, filename: string) {
  return `## Human summary

${request.summary}

## Permission gate

Maintainers/Cindy: do not apply this request unless the issue author's GitHub association is MEMBER, OWNER, or COLLABORATOR, or a repo member explicitly approves it in-thread.

## Machine-readable request

The full JSON request was too large for a prefilled GitHub Issue URL. Please attach the downloaded file to this issue before submitting it.

Expected attachment: \`${filename}\`
`
}

export function buildIssueUrl(issueRepositoryUrl: string, title: string, body: string) {
  const params = new URLSearchParams({
    title,
    labels: 'minigame-persist,needs-review',
    body,
  })
  return `${issueRepositoryUrl}?${params.toString()}`
}

export function buildIssueDraft<State>(issueRepositoryUrl: string, title: string, request: PersistRequest<State>, filenameBase: string): PersistIssueDraft {
  const prefilledUrl = buildIssueUrl(issueRepositoryUrl, title, buildIssueBody(request))

  if (prefilledUrl.length <= PREFILLED_ISSUE_URL_MAX_LENGTH) {
    return { url: prefilledUrl }
  }

  const filename = `${filenameBase}-persist-request-${new Date().toISOString().slice(0, 10)}.json`
  return {
    url: buildIssueUrl(issueRepositoryUrl, title, buildAttachmentIssueBody(request, filename)),
    attachment: {
      filename,
      content: `${JSON.stringify(request, null, 2)}\n`,
    },
  }
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
