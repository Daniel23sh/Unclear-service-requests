import React, { useState, useCallback } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import useSpeechToText from '../hooks/useSpeechToText';
import axios from 'axios';
import TeamCards from './ProRec'; // Import the TeamCards component

const MainSection = () => {
  const [inputValue, setInputValue] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  // Append transcript from speech-to-text to the existing inputValue
  const handleVoiceResult = useCallback((transcript) => {
    setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }, []);

  const { listening, startListening, stopListening } = useSpeechToText(
    isHebrew ? 'he-IL' : 'en-US',
    handleVoiceResult
  );

  const handleClick = async () => {
    console.log('handleClick triggered', { inputValue, listening });
    if (inputValue.trim() === '' || listening) {
      if (listening) {
        stopListening();
        console.log('Stopped listening');
      } else {
        startListening();
        console.log('Started listening');
      }
    } else {
      try {
        console.log('Sending text to backend:', inputValue);
        const res = await axios.post('http://localhost:8000/analyze_chatgpt', {
          message: inputValue,
        });
        console.log('Response received:', res.data);
        const data = res.data;
        setAnalysisResult(data);
        setInputValue('');  // Clear the input after sending

        // Since TeamCards uses its own internal data, we no longer need to set up a separate handyman list.
      } catch (error) {
        console.error('Error analyzing input:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24 px-4">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center mt-32">
        {t('helpsign')}
      </h2>

      <div className="w-full max-w-2xl bg-white rounded-md shadow-md p-4 sm:p-6">
        <div
          className={`flex items-center bg-gray-50 rounded-md border border-gray-300 p-3 ${
            isHebrew ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <input
            type="text"
            dir={isHebrew ? 'rtl' : 'ltr'}
            placeholder={t('searchbar')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
          />

          <button
            className={`text-gray-500 hover:text-gray-700 transition-colors ${
              isHebrew ? 'mr-2' : 'ml-2'
            }`}
            onClick={handleClick}
            title={
              listening
                ? t('stopListening') || 'Stop Listening'
                : inputValue.trim()
                ? t('send') || 'Send'
                : t('startListening') || 'Start Listening'
            }
          >
            {inputValue.trim() === '' || listening ? (
              <FaMicrophone
                size={20}
                className={listening ? 'text-red-500 animate-pulse' : ''}
              />
            ) : (
              <FiSend size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Display analysis result */}
      {analysisResult && (
        <div className="w-full max-w-2xl bg-white rounded-md shadow-md p-4 sm:p-6 mt-6">
          <h3 className="text-xl font-bold">Analysis Result</h3>
          {analysisResult.clarification_needed ? (
            <p className="text-red-500 mt-2">
              {t('clarifyRequest')}
            </p>
          ) : (
            <p className="text-green-600 mt-2">
              {t('problemCategoryIdentified', {
                category: t(`professions.${analysisResult.problem_category}`)
              })}
            </p>
          )}
        </div>
      )}

      {/* If analysis result exists and no clarification is needed, render the TeamCards component */}
      {analysisResult && !analysisResult.clarification_needed && (
        <div className="w-full max-w-2xl mt-6">
          <TeamCards
            category={t(`professions.${analysisResult.problem_category}`, {
              lng: "he",
            })}
          />

          </div>
      )}
    </div>
  );
};

export default MainSection;
