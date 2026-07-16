/**
 * A single word from a WhisperX word-level transcript.
 * Timestamps are in seconds from the start of the media file.
 */
export interface TranscriptWord {
  /** The word text, including any attached punctuation (e.g. "pipeline,"). */
  word: string;
  /** Start time in seconds. */
  start: number;
  /** End time in seconds. */
  end: number;
  /** Diarized speaker label (e.g. "SPEAKER_00"). May be absent if diarization was skipped. */
  speaker?: string;
  /** Alignment confidence score in [0, 1]. */
  score?: number;
}

/**
 * A single caption cue, ready to be rendered as SRT.
 */
export interface Cue {
  /** 1-based cue index, as required by the SRT format. */
  index: number;
  /** Display start time in seconds. */
  start: number;
  /** Display end time in seconds. */
  end: number;
  /** The caption text, one entry per rendered line. */
  lines: string[];
  /** Speaker label carried over from the first word in the cue. */
  speaker?: string;
}

/**
 * Options for the cue chunker. All fields are optional; see chunker.ts for defaults.
 */
export interface ChunkerOptions {
  maxLineLength?: number;
  maxLines?: number;
  maxCueDuration?: number;
  silenceGap?: number;
}
