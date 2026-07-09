# Shadowrun Minigame Persistence Pattern

## Design goal

Keep minigames static and player-friendly while preserving an auditable path for campaign-canon changes.

## State tiers

| Tier | Storage | Examples | Owner |
| --- | --- | --- | --- |
| Local draft | Browser `localStorage` | UI settings, session edits, unsent maintenance choices | Player/browser |
| Persistence request | GitHub Issue | End-of-run mutation packet with JSON | Player submits, maintainer reviews |
| Canonical state | Repo data/wiki files | committed upgrades, spent resources, page edits | Repo maintainers/Cindy |

## Issue body shape

Use plain text first and JSON second. Keep the fenced JSON block valid so Cindy can extract it reliably. For large full-state snapshots, do not force the full JSON into the issue URL; open a short prefilled issue and download the JSON request as an attachment file for the user to attach before submitting.

```json
{
  "schemaVersion": "shadowrun-minigame-persist/v1",
  "appId": "drone-dashboard",
  "createdAt": "2026-07-09T19:30:00.000Z",
  "authorization": {
    "requiredAuthorAssociation": ["MEMBER", "OWNER", "COLLABORATOR"],
    "fallback": "explicit approval from a repo member in this issue"
  },
  "canonicalTargets": ["src/data/drones.json", "campaign-wiki/Vehicles/Belmont.md"],
  "requestedChanges": []
}
```

## Navigation warning

Warn only when local state differs from the last submitted canonical-request snapshot. Local auto-save should stay quiet by itself; the warning is for unsubmitted global-impact changes.

## Security rules

- Do not run arbitrary issue JSON as code.
- Do not apply issues opened by public drive-by users.
- Prefer full replacement snapshots for simple apps and explicit mutation arrays for apps where conflicts matter. When a full snapshot exceeds the safe prefilled-URL budget, use a downloaded JSON attachment instead of a long URL.
- Commit canonical changes to source/data/wiki files, not generated `dist/` artifacts.
- Close issues with the commit hash and deployed URL when complete.
