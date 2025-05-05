
/**
 * Utility functions for analyzing audio features to detect speech patterns
 * like pauses, stutters, and prolonged sounds
 */

// Analyze audio for pauses (silent segments)
export const detectPauses = (audioData: Float32Array, sampleRate: number, silenceThreshold = 0.01, minPauseDuration = 0.3): Array<{start: number, end: number, duration: number}> => {
  const pauses = [];
  let isPause = false;
  let pauseStart = 0;
  
  // Calculate RMS (Root Mean Square) in frames
  const frameSize = Math.floor(0.025 * sampleRate); // 25ms frames
  const frames = Math.floor(audioData.length / frameSize);
  
  for (let i = 0; i < frames; i++) {
    const frameStart = i * frameSize;
    const frame = audioData.slice(frameStart, frameStart + frameSize);
    
    // Calculate RMS energy for this frame
    const energy = Math.sqrt(frame.reduce((sum, sample) => sum + sample * sample, 0) / frame.length);
    
    // Check if this frame is silent
    if (energy < silenceThreshold) {
      // Start of a pause
      if (!isPause) {
        isPause = true;
        pauseStart = i * frameSize / sampleRate; // Convert to seconds
      }
    } else {
      // End of a pause
      if (isPause) {
        isPause = false;
        const pauseEnd = i * frameSize / sampleRate;
        const pauseDuration = pauseEnd - pauseStart;
        
        // Only record pauses longer than minimum duration
        if (pauseDuration >= minPauseDuration) {
          pauses.push({
            start: pauseStart,
            end: pauseEnd,
            duration: pauseDuration
          });
        }
      }
    }
  }
  
  // Check if we're still in a pause at the end of the audio
  if (isPause) {
    const pauseEnd = audioData.length / sampleRate;
    const pauseDuration = pauseEnd - pauseStart;
    if (pauseDuration >= minPauseDuration) {
      pauses.push({
        start: pauseStart,
        end: pauseEnd,
        duration: pauseDuration
      });
    }
  }
  
  return pauses;
};

// Detect stutters by looking for repetitive patterns in the audio
export const detectStutters = (audioData: Float32Array, sampleRate: number): Array<{start: number, end: number}> => {
  // This is a simplified approach - in production you would want a more sophisticated algorithm
  const stutters = [];
  const frameSize = Math.floor(0.1 * sampleRate); // 100ms frames
  const frames = Math.floor(audioData.length / frameSize) - 1; // Need at least 2 frames to compare
  
  for (let i = 0; i < frames - 1; i++) {
    const frame1 = audioData.slice(i * frameSize, (i + 1) * frameSize);
    const frame2 = audioData.slice((i + 1) * frameSize, (i + 2) * frameSize);
    
    // Calculate cross-correlation between adjacent frames
    // High correlation could indicate repetitive sounds
    const correlation = calculateCorrelation(frame1, frame2);
    
    if (correlation > 0.8) { // Threshold for high correlation
      stutters.push({
        start: i * frameSize / sampleRate,
        end: (i + 2) * frameSize / sampleRate
      });
      
      // Skip the next frame since we already included it
      i++;
    }
  }
  
  return stutters;
};

// Helper function to calculate correlation between two audio frames
function calculateCorrelation(frame1: Float32Array, frame2: Float32Array): number {
  if (frame1.length !== frame2.length) return 0;
  
  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  const n = frame1.length;
  
  for (let i = 0; i < n; i++) {
    sum1 += frame1[i];
    sum2 += frame2[i];
    sum1Sq += frame1[i] * frame1[i];
    sum2Sq += frame2[i] * frame2[i];
    pSum += frame1[i] * frame2[i];
  }
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
}

// Detect prolonged sounds by analyzing the envelope of the audio
export const detectProlongedSounds = (audioData: Float32Array, sampleRate: number, threshold = 0.5): Array<{start: number, end: number}> => {
  const prolongedSounds = [];
  const frameSize = Math.floor(0.05 * sampleRate); // 50ms frames
  const frames = Math.floor(audioData.length / frameSize);
  
  let sustainStart = -1;
  let sustainCount = 0;
  let prevAmplitude = 0;
  
  for (let i = 0; i < frames; i++) {
    const frameStart = i * frameSize;
    const frame = audioData.slice(frameStart, frameStart + frameSize);
    
    // Calculate average amplitude for this frame
    const amplitude = frame.reduce((sum, sample) => sum + Math.abs(sample), 0) / frame.length;
    
    // Check for sustained sound (similar amplitude across frames)
    const amplitudeDiff = Math.abs(amplitude - prevAmplitude);
    
    if (amplitudeDiff < threshold && amplitude > 0.01) { // Some minimal energy and stable amplitude
      sustainCount++;
      
      if (sustainStart === -1) {
        sustainStart = i;
      }
    } else {
      // End of sustained sound
      if (sustainCount >= 4) { // At least 200ms of sustained sound (4 frames * 50ms)
        prolongedSounds.push({
          start: sustainStart * frameSize / sampleRate,
          end: i * frameSize / sampleRate
        });
      }
      
      sustainStart = -1;
      sustainCount = 0;
    }
    
    prevAmplitude = amplitude;
  }
  
  // Check if we're still tracking a prolonged sound at the end
  if (sustainCount >= 4) {
    prolongedSounds.push({
      start: sustainStart * frameSize / sampleRate,
      end: frames * frameSize / sampleRate
    });
  }
  
  return prolongedSounds;
};

// Combine Whisper's transcription with detected speech patterns
export const enhanceTranscription = (
  transcript: string,
  pauses: Array<{start: number, end: number, duration: number}>,
  stutters: Array<{start: number, end: number}>,
  prolongedSounds: Array<{start: number, end: number}>,
  wordTimings: Array<{word: string, start: number, end: number}> | null
): string => {
  // If we don't have word timings, we can't align the patterns with the text
  if (!wordTimings || wordTimings.length === 0) {
    // Just add pause annotations at the end
    let enhancedText = transcript;
    pauses.forEach(pause => {
      enhancedText += ` [${pause.duration.toFixed(1)}s pause]`;
    });
    return enhancedText;
  }
  
  // Clone the transcript and modify it with speech pattern annotations
  const enhancedWords: string[] = [];
  
  for (let i = 0; i < wordTimings.length; i++) {
    const { word, start, end } = wordTimings[i];
    let enhancedWord = word;
    
    // Check if this word overlaps with any stutters
    const overlappingStutters = stutters.filter(
      stutter => (start < stutter.end && end > stutter.start)
    );
    
    if (overlappingStutters.length > 0) {
      // Represent stuttering by repeating the first syllable
      const firstChar = word.charAt(0);
      enhancedWord = `${firstChar}-${firstChar}-${word}`;
    }
    
    // Check if this word overlaps with any prolonged sounds
    const overlappingProlonged = prolongedSounds.filter(
      sound => (start < sound.end && end > sound.start)
    );
    
    if (overlappingProlonged.length > 0) {
      // Represent prolonged sound by repeating vowels
      enhancedWord = addProlongedVowels(word);
    }
    
    enhancedWords.push(enhancedWord);
    
    // Check for pauses after this word
    if (i < wordTimings.length - 1) {
      const nextStart = wordTimings[i + 1].start;
      const gapDuration = nextStart - end;
      
      // Find pauses that fall in this gap
      const pausesInGap = pauses.filter(
        pause => (pause.start >= end && pause.end <= nextStart)
      );
      
      if (pausesInGap.length > 0) {
        // Add the longest pause
        const longestPause = pausesInGap.reduce(
          (longest, current) => current.duration > longest.duration ? current : longest,
          pausesInGap[0]
        );
        
        enhancedWords.push(`[${longestPause.duration.toFixed(1)}s pause]`);
      }
    }
  }
  
  return enhancedWords.join(' ');
};

// Helper function to add repeated vowels for prolonged sounds
function addProlongedVowels(word: string): string {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
  let result = '';
  let lastVowelIndex = -1;
  
  // Find the last vowel in the word
  for (let i = word.length - 1; i >= 0; i--) {
    if (vowels.includes(word[i].toLowerCase())) {
      lastVowelIndex = i;
      break;
    }
  }
  
  // If we found a vowel, repeat it
  if (lastVowelIndex >= 0) {
    for (let i = 0; i < word.length; i++) {
      result += word[i];
      if (i === lastVowelIndex) {
        // Repeat the vowel 2-3 times to represent prolongation
        result += word[i].repeat(2);
      }
    }
    return result;
  }
  
  // No vowel found, return original word
  return word;
}
