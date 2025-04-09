// src/hooks/useSpeechToText.js
import { useEffect, useRef, useState } from 'react';

const useSpeechToText = (language = 'en-US', onResult, timeoutMs = 5000) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);

      // Stop recording after X milliseconds
      timeoutRef.current = setTimeout(() => {
        recognition.stop();
      }, timeoutMs);
    };

    recognition.onend = () => {
      setListening(false);
      clearTimeout(timeoutRef.current);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognitionRef.current = recognition;
  }, [language, onResult, timeoutMs]);

  const startListening = () => {
    if (!listening) recognitionRef.current?.start();
  };

  return {
    listening,
    startListening,
  };
};

export default useSpeechToText;
