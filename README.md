# clip-captions

Turns WhisperX word-level transcripts into SRT caption files for short
vertical clips.

## Your task

This module was written by an AI coding agent working from `SPEC.md`, and has
been opened as a PR. CI is green — the unit tests pass.

**Within 25 minutes, get this branch into a state that *you* would merge.**
`SPEC.md` is the source of truth: mergeable means the implementation matches
the spec. You may use Claude Code (or any tools) however you like.

When you're done, tell the interviewer:
1. what you changed and why, and
2. whether you would now merge it — and if not, what's still missing.

## Submitting your work

Before you submit, add a short `NOTES.md` at the repo root: what you changed,
what you'd still do with more time, and whether you would merge.

Then push your work to a **new private repository of your own** and invite the
interviewer as a collaborator:

```bash
git add -A && git commit -m "submission"
gh repo create <your-username>/clip-captions-submission --private --source . --push
```

Then invite the interviewer's GitHub account to that repo (Settings →
Collaborators), or share the private repo link.

> **Please do NOT "Fork" this repo.** A fork of a public repository is itself
> public and would expose your solution to other candidates. Use a new
> **private** repo as above.

If you can't push (not logged in to `gh` on this machine), hand the
interviewer a patch file instead:

```bash
git add -A && git diff origin/main > yourname.patch
```

## Getting started

Requires Node 18.18+ (Node 20 recommended).

```bash
npm install
npm test                                        # run the unit tests
npx tsx src/cli.ts sample_data/interview_clip.json   # generate captions to stdout
```

`sample_data/interview_clip.json` is a real diarized transcript of a
two-speaker interview clip (~25 s).

## Layout

```
SPEC.md          the specification (source of truth)
src/chunker.ts   groups words into caption cues
src/srt.ts       SRT timestamp formatting + rendering
src/cli.ts       command-line entry point
src/types.ts     shared types
tests/           unit tests
```
