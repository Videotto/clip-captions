import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chunkWords, DISPLAY_PADDING } from '../src/chunker.js';
import type { TranscriptWord } from '../src/types.js';

/** Builds evenly timed words from a sentence for test setup. */
function makeWords(
  text: string,
  { speaker = 'SPEAKER_00', startAt = 0, wordDuration = 0.3, gap = 0.05 } = {},
): TranscriptWord[] {
  let t = startAt;
  return text.split(' ').map((word) => {
    const w = { word, start: t, end: t + wordDuration, speaker };
    t = w.end + gap;
    return w;
  });
}

describe('chunkWords', () => {
  it('keeps a short utterance in a single cue', () => {
    const cues = chunkWords(makeWords('Ship it today.'));
    expect(cues).toHaveLength(1);
    expect(cues[0].index).toBe(1);
    expect(cues[0].lines.join(' ')).toBe('Ship it today.');
  });

  it('starts a new cue when the speaker changes', () => {
    const a = makeWords('How long does it take?', { speaker: 'SPEAKER_00' });
    const b = makeWords('About four minutes.', {
      speaker: 'SPEAKER_01',
      startAt: a[a.length - 1].end + 0.3,
    });
    const cues = chunkWords([...a, ...b]);
    expect(cues).toHaveLength(2);
    expect(cues[0].speaker).toBe('SPEAKER_00');
    expect(cues[1].speaker).toBe('SPEAKER_01');
  });

  it('starts a new cue after a silence gap', () => {
    const a = makeWords('First thought.');
    const b = makeWords('Second thought.', { startAt: a[a.length - 1].end + 0.8 });
    const cues = chunkWords([...a, ...b]);
    expect(cues).toHaveLength(2);
  });

  it('splits cues that would run past the max duration', () => {
    const words = makeWords('one two three four five six seven eight nine ten eleven twelve', {
      wordDuration: 0.55,
      gap: 0.05,
    });
    const cues = chunkWords(words);
    expect(cues.length).toBeGreaterThan(1);
  });

  it('never splits a word across lines', () => {
    const words = makeWords('the quick brown fox jumps over the extraordinarily lazy dog');
    const cues = chunkWords(words);
    const rendered = cues.flatMap((c) => c.lines.join(' ').split(' '));
    expect(rendered).toEqual(words.map((w) => w.word));
  });

  it('wraps long sentences onto two lines', () => {
    const cues = chunkWords(makeWords('this pipeline renders vertical clips for social'));
    expect(cues).toHaveLength(1);
    expect(cues[0].lines).toEqual(['this pipeline renders vertical', 'clips for social']);
  });

  it('adds display padding after the last word', () => {
    const a = makeWords('Padding check.');
    const b = makeWords('Next cue.', { startAt: a[a.length - 1].end + 1.0 });
    const cues = chunkWords([...a, ...b]);
    expect(cues[0].end).toBeCloseTo(a[a.length - 1].end + DISPLAY_PADDING, 5);
  });

  it('handles a full transcript', () => {
    const words: TranscriptWord[] = JSON.parse(
      readFileSync(new URL('../sample_data/interview_clip.json', import.meta.url), 'utf-8'),
    );
    const cues = chunkWords(words);
    expect(cues.length).toBeGreaterThan(0);
    expect(cues[0].index).toBe(1);
  });
});
