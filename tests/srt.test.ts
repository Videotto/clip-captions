import { describe, expect, it } from 'vitest';
import { formatTimestamp, renderSrt } from '../src/srt.js';

describe('formatTimestamp', () => {
  it('formats whole and fractional seconds', () => {
    expect(formatTimestamp(1.5)).toBe('00:00:01,500');
    expect(formatTimestamp(59.999)).toBe('00:00:59,999');
  });

  it('carries into minutes and hours', () => {
    expect(formatTimestamp(3661.25)).toBe('01:01:01,250');
  });
});

describe('renderSrt', () => {
  it('renders cues in SRT format with a blank line between cues', () => {
    const srt = renderSrt([
      { index: 1, start: 0.5, end: 2.25, lines: ['Hello there.'] },
      { index: 2, start: 2.75, end: 4.5, lines: ['General', 'Kenobi.'] },
    ]);
    expect(srt).toBe(
      '1\n' +
        '00:00:00,500 --> 00:00:02,250\n' +
        'Hello there.\n' +
        '\n' +
        '2\n' +
        '00:00:02,750 --> 00:00:04,500\n' +
        'General\n' +
        'Kenobi.\n',
    );
  });
});
