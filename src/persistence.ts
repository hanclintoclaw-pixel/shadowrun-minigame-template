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

export function buildIssueUrl<State>(issueRepositoryUrl: string, title: string, request: PersistRequest<State>) {
  const params = new URLSearchParams({
    title,
    labels: 'minigame-persist,needs-review',
    body: buildIssueBody(request),
  })
  return `${issueRepositoryUrl}?${params.toString()}`
}
