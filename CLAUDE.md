# CLAUDE.md — LLL-Web

## Brain inbox

When you make a decision, fix a hard bug, or end a batch,
drop one short note for Hashem's second brain:

- Where: `brain-inbox/` at this repo's root (create it if missing).
- Name: `YYYY-MM-DD-<project>-<kind>.md`,
  e.g. `2026-10-21-lll-web-decision.md`. A second one that day: add `-2`.
- kind: `decision`, `changelog`, or `lesson`
  (a hard bug and its fix, or a gotcha).
- Start with this header, then 3-10 plain-English lines:
  what happened, why, and where the proof is.

    ---
    project: LLL-Web
    date: 2026-10-21
    kind: decision
    source: local      # cloud, in a cloud session
    ---

- Commit it by named path with your other changes. Never edit the
  vault yourself: Hashem files notes at the Monday review.
- Never put secrets or real people's personal data in a note.
- This repo is public: brain-inbox/ is git-excluded, so save the note and don't commit it.
