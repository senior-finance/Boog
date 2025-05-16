import React, { createContext, useContext, useState } from 'react';

const SeniorModeContext = createContext();

export const SeniorModeProvider = ({ children }) => {
  const [seniorMode, setSeniorMode] = useState(true);
  return (
    <SeniorModeContext.Provider value={{ seniorMode, setSeniorMode }}>
      {children}
    </SeniorModeContext.Provider>
  );
};

export const useSeniorMode = () => useContext(SeniorModeContext);