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

## Getting started

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
