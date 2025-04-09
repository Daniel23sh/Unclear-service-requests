// src/components/MainSection.jsx
import React, { useState } from 'react';
import { FaSearch, FaMicrophone  } from 'react-icons/fa';
import { FiSend, FiAlignJustify } from 'react-icons/fi'; // Send = arrow up, AlignJustify = bars

const MainSection = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col items-center justify-center pt-24 px-4">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
        What can I help with?
      </h2>

      {/* Container Box */}
      <div className="w-full max-w-2xl bg-white rounded-md shadow-md p-4 sm:p-6">
        {/* Top row: Input + icons */}
        <div className="flex items-center bg-gray-50 rounded-md border border-gray-300 p-3">
          {/* Input field */}
          <input
            type="text"
            placeholder="Ask anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />

          {/* Icon button on the right */}
          <button className="ml-3 text-gray-500 hover:text-gray-700 transition-colors">
            {inputValue.trim() === '' ? <FaMicrophone size={20} /> : <FiSend size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
