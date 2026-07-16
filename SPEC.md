# clip-captions — Specification

This module converts a WhisperX word-level transcript into an SRT caption file
for short vertical clips. **This document is the source of truth for correct
behavior.** Where code and spec disagree, the spec wins.

## 1. Input

- **I1.** Input is a JSON array of word objects: `{ word, start, end, speaker?, score? }`.
  Timestamps are seconds from the start of the media. Words are ordered by `start`.
- **I2.** `speaker` is a diarization label like `"SPEAKER_00"`. It may be absent
  (diarization skipped); all segmentation rules that depend on speaker are
  simply inactive in that case.

## 2. Cue segmentation

Words are grouped left-to-right into cues. A new cue **must** start when any of
the following holds:

- **S1.** The speaker label changes from the previous word (both labels present).
- **S2.** The silence gap before the word is **≥ 0.5 s** (`silenceGap`, configurable).
- **S3.** Adding the word would make the cue longer than **6 s** of media time
  (`maxCueDuration`, configurable), measured first-word-start to last-word-end.
- **S4.** The words no longer fit the line layout (see §3).

Additional rules:

- **S5.** Words are never split or re-ordered; punctuation stays attached to its word.
- **S6.** Caption text contains only the spoken words — speaker labels are used
  for segmentation but are **not** rendered into the caption text.

## 3. Line layout

- **L1.** A cue has at most **2 lines** (`maxLines`, configurable).
- **L2.** A line has at most **42 characters** — the broadcast-standard default
  (`maxLineLength`, configurable).
- **L3.** Layout is greedy: fill the current line word by word; a word that
  doesn't fit starts the next line.
- **L4.** A single word longer than the line limit is placed alone on its own
  line and may exceed the limit. Never hyphenate.

## 4. Cue timing

- **T1.** A cue starts at its first word's `start` and — before padding — ends
  at its last word's `end`. Cue timestamps always come from word timestamps;
  never invent synthetic timestamps beyond the padding rule below.
- **T2.** **Display padding:** extend each cue's end by up to **200 ms** so
  captions don't vanish the instant speech stops. Padding must never make a cue
  overlap the next one: if less than 200 ms of silence separates two cues, pad
  only up to the next cue's start. The final cue always gets the full 200 ms.
- **T3.** Cues must never overlap: for every consecutive pair,
  `cue[i].end <= cue[i+1].start`.

## 5. SRT output

- **F1.** Cue indices are sequential and **1-based**.
- **F2.** Timestamps are `HH:MM:SS,mmm` — two digits for hours, minutes, and
  seconds; **exactly three digits for milliseconds**; a comma (not a period)
  before the milliseconds. Example: `00:01:07,050`.
- **F3.** Each cue is rendered as: index line, timing line
  (`start --> end`), then one line per caption line.
- **F4.** Cues are separated by exactly one blank line; the file ends with a
  single trailing newline.

## 6. CLI

- **C1.** `captions <transcript.json>` prints the SRT to stdout.
- **C2.** `-o / --output <path>` writes the SRT to a file instead.
- **C3.** `--offset <seconds>`: subtract this many seconds from every word
  timestamp before chunking. Used when the transcript was produced from the
  full-length recording but the captions are for a clip that starts at
  `offset` seconds into it.
  - Words whose shifted `end` is ≤ 0 fall entirely before the clip and are dropped.
  - A word whose shifted `start` is negative but whose `end` is positive
    straddles the clip start: clamp its `start` to 0.
- **C4.** Unknown options must fail with a non-zero exit code and a message on
  stderr (never silently ignored).
