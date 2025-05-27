import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSeniorMode } from '../../components/SeniorModeContext'; // ✅ 추가

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const { seniorMode } = useSeniorMode(); // ✅ SeniorModeContext에서 상태 받기

  useEffect(() => {
    const load = async () => {
      const savedSize = await AsyncStorage.getItem('fontSize');
      if (savedSize) setFontSize(Number(savedSize));
    };
    load();
  }, []);

  // ✅ seniorMode가 바뀌면 기본 글자 크기 자동 반영
  useEffect(() => {
    if (seniorMode && fontSize < 20) {
      setFontSize(20);
    } else if (!seniorMode && fontSize > 16) {
      setFontSize(16); // 일반 모드로 돌아가면 기본값 복원
    }
  }, [seniorMode]);

  useEffect(() => {
    AsyncStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);