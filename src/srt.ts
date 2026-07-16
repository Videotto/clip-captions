import type { Cue } from './types.js';

const pad = (value: number, width = 2): string => String(value).padStart(width, '0');

/**
 * Formats a time in seconds as an SRT timestamp: HH:MM:SS,mmm
 * (comma before the milliseconds, per the SRT specification).
 */
export function formatTimestamp(seconds: number): string {
  const totalMs = Math.round(seconds * 1000);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1_000);
  const millis = totalMs % 1_000;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(millis)}`;
}

/**
 * Renders a list of cues as the full text of an .srt file.
 * Cues are separated by a blank line; the file ends with a trailing newline.
 */
export function renderSrt(cues: Cue[]): string {
  return (
    cues
      .map(
        (cue) =>
          `${cue.index}\n` +
          `${formatTimestamp(cue.start)} --> ${formatTimestamp(cue.end)}\n` +
          cue.lines.join('\n'),
      )
      .join('\n\n') + '\n'
  );
}
