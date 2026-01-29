import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MicrophoneIcon, StopIcon, ProcessingIcon, UploadIcon } from './Icons';

async function transcribeWithGroq(audioBase64: string, mimeType: string): Promise<string> {
  // Minimal local transcription helper: attempt to call a backend transcription endpoint if available,
  // otherwise return an empty string to keep the UI functional.
  try {
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType }),
    });
    if (!res.ok) {
      console.warn('Transcription API responded with status', res.status);
      return '';
    }
    const data = await res.json();
    return typeof data?.transcript === 'string' ? data.transcript : '';
  } catch (err) {
    console.error('transcribeWithGroq error', err);
    return '';
  }
}

interface VoiceControlProps {
  onSearch: (text: string) => void;
  isLoading: boolean;
}

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

export default function VoiceControl({ onSearch, isLoading }: VoiceControlProps): React.JSX.Element {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const memoizedOnSearch = useCallback(onSearch, [onSearch]);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      memoizedOnSearch(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setTranscriptionError("Microphone access denied. Please allow microphone access in your browser settings.");
      } else {
        setTranscriptionError("Live recording failed. Please try again.");
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [memoizedOnSearch]);

  const toggleRecording = () => {
    if (!isSpeechRecognitionSupported) {
      alert("Sorry, your browser doesn't support voice commands.");
      return;
    }
    setTranscriptionError(null);

    try {
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      } else {
        recognitionRef.current?.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      setTranscriptionError("Failed to start/stop recording. Please try again.");
      setIsRecording(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTranscriptionError(null);
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const transcript = await transcribeWithGroq(base64String, file.type);
          onSearch(transcript);
        } catch (err) {
          console.error(err);
          setTranscriptionError(err instanceof Error ? err.message : 'File transcription failed.');
        } finally {
          setIsTranscribing(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.onerror = () => {
        console.error('File reading error');
        setTranscriptionError('Could not read the selected file.');
        setIsTranscribing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setTranscriptionError('An unexpected error occurred during file processing.');
      setIsTranscribing(false);
    }
  };

  const getButtonState = () => {
    if (isLoading || isTranscribing) {
      return {
        text: isLoading ? 'Searching...' : 'Transcribing...',
        icon: <ProcessingIcon />,
        style: 'bg-gray-600 text-white cursor-not-allowed',
        disabled: true,
      };
    }
    if (isRecording) {
      return {
        text: 'Listening...',
        icon: <StopIcon />,
        style: 'bg-red-600 hover:bg-red-700 text-white',
        disabled: false,
      };
    }
    return {
      text: 'Tap to Speak',
      icon: <MicrophoneIcon />,
      style: 'bg-primary hover:bg-primary-dark text-white',
      disabled: false,
    };
  };

  const { text, icon, style, disabled } = getButtonState();

  return (
    <div className="my-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={toggleRecording}
          disabled={disabled}
          className={`w-64 h-16 inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark ring-offset-background-deep transition-all duration-300 transform hover:scale-105 ${style}`}
        >
          {icon}
          <span className="ml-3">{text}</span>
        </button>
        <span className="text-gray-400">or</span>
        <label
          htmlFor="audio-upload"
          className={`w-64 h-16 inline-flex items-center justify-center px-6 py-3 border border-primary-dark text-lg font-medium rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${disabled ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-background hover:bg-background/70 text-primary cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-dark ring-offset-background-deep'}`}
        >
          <UploadIcon />
          <span className="ml-3">Upload Audio</span>
        </label>
        <input
          id="audio-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="audio/*"
          disabled={disabled}
          ref={fileInputRef}
        />
      </div>
      {transcriptionError && (
        <div className="mt-4 text-red-400" role="alert">
          {transcriptionError}
        </div>
      )}
    </div>
  );
}

