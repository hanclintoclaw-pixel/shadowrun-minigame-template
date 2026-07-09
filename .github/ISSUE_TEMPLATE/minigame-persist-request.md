---
name: Minigame persist request
about: Request canonical repo updates from a static Shadowrun minigame
title: "Persist minigame changes: <app> <date>"
labels: [minigame-persist, needs-review]
assignees: []
---

## Human summary

Who made the change, what happened in play, and what should become campaign canon?

## Permission gate

- [ ] I am a member/collaborator of this repository or was explicitly delegated by one.
- [ ] I understand this issue is a request queue item, not an automatic write to canon.

Maintainers/Cindy: do not act on this request unless the issue author's GitHub association is `MEMBER`, `OWNER`, or `COLLABORATOR`, or a repo member explicitly approves it in-thread.

## Machine-readable request

```json
{
  "schemaVersion": "shadowrun-minigame-persist/v1",
  "appId": "example-minigame",
  "appName": "Example Minigame",
  "createdAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "authorization": {
    "requiredAuthorAssociation": ["MEMBER", "OWNER", "COLLABORATOR"],
    "fallback": "explicit approval from a repo member in this issue"
  },
  "summary": "Short human-readable summary.",
  "canonicalTargets": ["data/example.json", "campaign-wiki/path.md"],
  "requestedChanges": []
}
```
