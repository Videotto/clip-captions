import type { TranscriptWord, Cue, ChunkerOptions } from './types.js';

export const DEFAULT_MAX_LINE_LENGTH = 32;
export const DEFAULT_MAX_LINES = 2;
export const DEFAULT_MAX_CUE_DURATION = 6;
export const DEFAULT_SILENCE_GAP = 0.5;

/** Display padding added after the last word of a cue, in seconds. */
export const DISPLAY_PADDING = 0.2;

/**
 * Groups transcript words into caption cues.
 *
 * A new cue starts whenever:
 *  - the speaker changes,
 *  - a silence gap of at least `silenceGap` seconds precedes the word,
 *  - adding the word would push the cue past `maxCueDuration` seconds, or
 *  - the word no longer fits within `maxLines` lines of `maxLineLength` chars.
 */
export function chunkWords(words: TranscriptWord[], options: ChunkerOptions = {}): Cue[] {
  const maxLineLength = options.maxLineLength ?? DEFAULT_MAX_LINE_LENGTH;
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;
  const maxCueDuration = options.maxCueDuration ?? DEFAULT_MAX_CUE_DURATION;
  const silenceGap = options.silenceGap ?? DEFAULT_SILENCE_GAP;

  const cues: Cue[] = [];
  let current: TranscriptWord[] = [];

  const flush = (): void => {
    if (current.length === 0) return;
    const lines = layoutLines(
      current.map((w) => w.word),
      maxLineLength,
      maxLines,
    );
    cues.push({
      index: cues.length + 1,
      start: current[0].start,
      end: current[current.length - 1].end + DISPLAY_PADDING,
      lines: lines ?? [current.map((w) => w.word).join(' ')],
      speaker: current[0].speaker,
    });
    current = [];
  };

  for (const word of words) {
    if (current.length > 0) {
      const last = current[current.length - 1];
      const gap = word.start - last.end;
      const speakerChanged =
        word.speaker !== undefined && last.speaker !== undefined && word.speaker !== last.speaker;
      const wouldExceedDuration = word.end - current[0].start > maxCueDuration;
      const fits =
        layoutLines(
          [...current, word].map((w) => w.word),
          maxLineLength,
          maxLines,
        ) !== null;

      if (speakerChanged || gap >= silenceGap || wouldExceedDuration || !fits) {
        flush();
      }
    }
    current.push(word);
  }
  flush();

  return cues;
}

/**
 * Greedily lays out words into caption lines.
 *
 * Words are never split or hyphenated. A single word longer than
 * `maxLineLength` is placed alone on its own line and may exceed the limit.
 *
 * Returns null if the words do not fit within `maxLines` lines.
 */
export function layoutLines(
  tokens: string[],
  maxLineLength: number,
  maxLines: number,
): string[] | null {
  const lines: string[] = [];
  let line = '';

  for (const token of tokens) {
    if (line === '') {
      line = token;
    } else if (line.length + 1 + token.length <= maxLineLength) {
      line += ' ' + token;
    } else {
      lines.push(line);
      line = token;
    }
  }
  if (line !== '') {
    lines.push(line);
  }

  return lines.length > maxLines ? null : lines;
}
