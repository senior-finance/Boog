import React, { createContext, useContext, useState } from 'react';

const VolumeContext = createContext();

export const VolumeProvider = ({ children }) => {
  const [systemVolume, setSystemVolume] = useState(0.5); // 초기값 50%

  return (
    <VolumeContext.Provider value={{ systemVolume, setSystemVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = () => useContext(VolumeContext);