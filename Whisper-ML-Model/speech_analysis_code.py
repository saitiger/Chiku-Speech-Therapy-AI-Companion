import numpy as np
import librosa
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import matplotlib.pyplot as plt
from scipy.signal import find_peaks

class SpeechPatternAnalyzer:
    def __init__(self, whisper_model="openai/whisper-small"):
        """Initialize the speech pattern analyzer with Whisper model."""
        self.processor = WhisperProcessor.from_pretrained(whisper_model)
        self.model = WhisperForConditionalGeneration.from_pretrained(whisper_model)
        self.model.eval()
        
    def analyze_speech(self, audio_file_path):
        """Main function to analyze speech patterns."""
        # Load audio
        audio_data, sample_rate = librosa.load(audio_file_path, sr=16000)
        
        # Get Whisper transcription
        whisper_result = self._transcribe_with_whisper(audio_data)
        
        # Analyze audio features
        speech_features = self._extract_speech_features(audio_data, sample_rate)
        
        # Analyze confidence scores
        confidence_analysis = self._analyze_confidence_scores(audio_data)
        
        # Combine results
        analysis_result = self._combine_analysis(whisper_result, speech_features, confidence_analysis)
        
        return analysis_result
    
    def _transcribe_with_whisper(self, audio_data):
        """Transcribe audio using Whisper and get word-level timing."""
        input_features = self.processor(audio_data, sampling_rate=16000, return_tensors="pt").input_features
        
        with torch.no_grad():
            # Get logits and predicted ids
            logits = self.model.generate(input_features, return_dict_in_generate=True, output_scores=True)
            
        # Get the transcript
        transcript = self.processor.batch_decode(logits.sequences, skip_special_tokens=True)[0]
        
        # Get confidence scores (simplified approach)
        confidences = self._extract_confidence_scores(logits)
        
        return {
            "transcript": transcript,
            "confidences": confidences
        }
    
    def _extract_confidence_scores(self, generation_output):
        """Extract word-level confidence scores from Whisper output."""
        # This is a simplified approach - a more sophisticated implementation would
        # align log probabilities with decoded tokens
        scores = []
        for step_scores in generation_output.scores:
            # Get the probability of the selected token
            probs = torch.nn.functional.softmax(step_scores[0], dim=-1)
            # Get the probability of the selected token
            selected_token_prob = probs[generation_output.sequences[0][len(scores) + 1]].item()
            scores.append(selected_token_prob)
        
        return scores
    
    def _extract_speech_features(self, audio_data, sample_rate):
        """Extract speech features directly from audio."""
        features = {}
        
        # 1. Detect pauses using energy/amplitude threshold
        energy = librosa.feature.rms(y=audio_data).flatten()
        silence_threshold = 0.01  # Adjust based on your audio
        is_silence = energy < silence_threshold
        
        # Find silent segments longer than 0.2 seconds
        silence_segments = []
        current_segment = None
        
        for i, silent in enumerate(is_silence):
            frame_time = librosa.frames_to_time(i, sr=sample_rate)
            if silent and current_segment is None:
                current_segment = {"start": frame_time}
            elif not silent and current_segment is not None:
                current_segment["end"] = frame_time
                current_segment["duration"] = current_segment["end"] - current_segment["start"]
                if current_segment["duration"] > 0.2:  # Only count pauses > 200ms
                    silence_segments.append(current_segment)
                current_segment = None
        
        features["pauses"] = silence_segments
        
        # 2. Detect stuttering using repeated patterns in the audio
        # Look for repetitive patterns in the onset envelope
        onset_env = librosa.onset.onset_strength(y=audio_data, sr=sample_rate)
        peaks, _ = find_peaks(onset_env, height=0.1, distance=3)
        peak_times = librosa.frames_to_time(peaks, sr=sample_rate)
        
        # Look for closely spaced peaks that might indicate repetitive sounds
        stutters = []
        for i in range(len(peak_times) - 1):
            if 0.05 < peak_times[i+1] - peak_times[i] < 0.2:  # Typical stutter timeframe
                stutters.append({
                    "time": peak_times[i],
                    "duration": peak_times[i+1] - peak_times[i]
                })
        
        features["potential_stutters"] = stutters
        
        # 3. Detect prolonged sounds
        # We'll use the root mean square energy and look for sustained high energy
        frame_length = int(sample_rate * 0.025)  # 25ms frames
        hop_length = int(sample_rate * 0.01)     # 10ms hop
        
        rms = librosa.feature.rms(y=audio_data, frame_length=frame_length, hop_length=hop_length)[0]
        rms_times = librosa.times_like(rms, sr=sample_rate, hop_length=hop_length)
        
        prolonged_sounds = []
        threshold = np.mean(rms) * 1.2  # Adjust based on your audio
        current_prolonged = None
        
        for i, energy in enumerate(rms):
            if energy > threshold and current_prolonged is None:
                current_prolonged = {"start": rms_times[i]}
            elif (energy < threshold and current_prolonged is not None) or (i == len(rms) - 1 and current_prolonged is not None):
                current_prolonged["end"] = rms_times[i]
                current_prolonged["duration"] = current_prolonged["end"] - current_prolonged["start"]
                if current_prolonged["duration"] > 0.3:  # Only count if longer than 300ms
                    prolonged_sounds.append(current_prolonged)
                current_prolonged = None
        
        features["prolonged_sounds"] = prolonged_sounds
        
        return features
    
    def _analyze_confidence_scores(self, audio_data):
        """Analyze confidence patterns that might indicate speech issues."""
        # In a real implementation, this would use the detailed word-level 
        # confidence scores from Whisper's output
        
        # For now, we'll use a placeholder implementation
        # Low confidence or sudden drops in confidence can indicate speech issues
        
        return {
            "confidence_dips": [],  # Will be populated in the real implementation
            "overall_confidence": 0.0
        }
    
    def _combine_analysis(self, whisper_result, speech_features, confidence_analysis):
        """Combine all analysis results into a structured output."""
        # Merge all the analyses into a single comprehensive result
        result = {
            "transcript": whisper_result["transcript"],
            "enhanced_transcript": self._create_enhanced_transcript(
                whisper_result["transcript"], 
                speech_features, 
                whisper_result["confidences"]
            ),
            "speech_patterns": {
                "pauses": speech_features["pauses"],
                "stutters": speech_features["potential_stutters"],
                "prolonged_sounds": speech_features["prolonged_sounds"],
            },
            "speech_quality_metrics": {
                "fluency_score": self._calculate_fluency_score(speech_features),
                "confidence_patterns": confidence_analysis
            }
        }
        
        return result
    
    def _create_enhanced_transcript(self, transcript, speech_features, confidences):
        """Create a transcript that includes speech pattern markers."""
        # This is a placeholder - a real implementation would align the 
        # detected features with the transcript text
        
        # For now, we'll just add some markers based on timing
        # In a real implementation, you would use forced alignment to match
        # the text with the audio timing
        
        enhanced = transcript
        
        # Add pause markers (simplified approach)
        for pause in speech_features["pauses"]:
            # This is very simplified and would need proper alignment in practice
            enhanced = enhanced.replace(". ", f". [{pause['duration']:.1f}s pause] ")
        
        # Similarly for stutters and prolonged sounds
        # This would need proper alignment in a real implementation
        
        return enhanced
    
    def _calculate_fluency_score(self, speech_features):
        """Calculate an overall fluency score based on detected patterns."""
        # Count issues
        num_pauses = len(speech_features["pauses"])
        num_stutters = len(speech_features["potential_stutters"])
        num_prolonged = len(speech_features["prolonged_sounds"])
        
        # Simple scoring algorithm - would be refined in a real implementation
        # Lower score means more speech issues detected
        base_score = 100
        deductions = (num_pauses * 2) + (num_stutters * 5) + (num_prolonged * 3)
        
        fluency_score = max(0, base_score - deductions)
        
        return fluency_score
    
    def visualize_analysis(self, audio_file_path, analysis_result=None):
        """Create a visualization of the speech analysis."""
        if analysis_result is None:
            analysis_result = self.analyze_speech(audio_file_path)
        
        # Load audio for visualization
        audio_data, sample_rate = librosa.load(audio_file_path, sr=16000)
        
        # Create plot
        plt.figure(figsize=(15, 10))
        
        # Plot waveform
        plt.subplot(3, 1, 1)
        plt.title("Audio Waveform with Detected Speech Patterns")
        librosa.display.waveshow(audio_data, sr=sample_rate)
        
        # Mark pauses
        for pause in analysis_result["speech_patterns"]["pauses"]:
            plt.axvspan(pause["start"], pause["end"], color="red", alpha=0.3)
        
        # Mark potential stutters
        for stutter in analysis_result["speech_patterns"]["stutters"]:
            plt.axvline(x=stutter["time"], color="green", linestyle="--")
        
        # Mark prolonged sounds
        for prolonged in analysis_result["speech_patterns"]["prolonged_sounds"]:
            plt.axvspan(prolonged["start"], prolonged["end"], color="blue", alpha=0.3)
        
        # Plot spectrogram
        plt.subplot(3, 1, 2)
        plt.title("Spectrogram")
        D = librosa.amplitude_to_db(np.abs(librosa.stft(audio_data)), ref=np.max)
        librosa.display.specshow(D, sr=sample_rate, x_axis='time', y_axis='log')
        plt.colorbar(format='%+2.0f dB')
        
        # Plot energy
        plt.subplot(3, 1, 3)
        plt.title("Energy (RMS)")
        energy = librosa.feature.rms(y=audio_data)[0]
        plt.plot(librosa.times_like(energy, sr=sample_rate), energy)
        
        plt.tight_layout()
        return plt

# Example usage
if __name__ == "__main__":
    analyzer = SpeechPatternAnalyzer()
    result = analyzer.analyze_speech("sample_speech.wav")
    
    print(f"Transcript: {result['transcript']}")
    print(f"Enhanced Transcript: {result['enhanced_transcript']}")
    print(f"Fluency Score: {result['speech_quality_metrics']['fluency_score']}")
    
    # Print detected patterns
    print(f"Detected {len(result['speech_patterns']['pauses'])} significant pauses")
    print(f"Detected {len(result['speech_patterns']['stutters'])} potential stutters")
    print(f"Detected {len(result['speech_patterns']['prolonged_sounds'])} prolonged sounds")
    
    # Visualize
    analyzer.visualize_analysis("sample_speech.wav", result)
    plt.savefig("speech_analysis.png")
    plt.show()