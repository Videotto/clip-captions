#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { chunkWords } from './chunker.js';
import { renderSrt } from './srt.js';
import type { TranscriptWord } from './types.js';

const USAGE = `Usage: captions <transcript.json> [-o <output.srt>]

Generates an SRT caption file from a WhisperX word-level transcript.

Options:
  -o, --output <path>   Write the SRT to this path (default: stdout)
`;

function main(): void {
  const args = process.argv.slice(2);
  let inputPath: string | undefined;
  let outputPath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-o' || arg === '--output') {
      outputPath = args[++i];
    } else if (arg === '-h' || arg === '--help') {
      process.stdout.write(USAGE);
      return;
    } else if (arg.startsWith('-')) {
      process.stderr.write(`Unknown option: ${arg}\n`);
      process.exit(2);
    } else {
      inputPath = arg;
    }
  }

  if (!inputPath) {
    process.stderr.write(USAGE);
    process.exit(2);
  }

  let words: TranscriptWord[];
  try {
    words = JSON.parse(readFileSync(inputPath, 'utf-8'));
  } catch (err) {
    process.stderr.write(`Failed to read transcript: ${(err as Error).message}\n`);
    process.exit(1);
  }

  const cues = chunkWords(words!);
  const srt = renderSrt(cues);

  if (outputPath) {
    writeFileSync(outputPath, srt);
    process.stderr.write(`Wrote ${cues.length} cues to ${outputPath}\n`);
  } else {
    process.stdout.write(srt);
  }
}

main();
