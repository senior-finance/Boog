// src/screens/Info/FontSizeContext.js
import React, { createContext, useContext, useState } from 'react';
import CustomText from '../../components/CustomText';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16); // 초기값 설정

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
