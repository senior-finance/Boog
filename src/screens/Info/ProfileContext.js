import React, { createContext, useState } from 'react';
import { Image } from 'react-native';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  // 기본 프로필 이미지는 로컬 이미지 경로를 이용해 초기화합니다.
  const defaultProfile = Image.resolveAssetSource(require('../../assets/minecraft-skin-head-girl.png')).uri;
  const [profileUri, setProfileUri] = useState(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profileUri, setProfileUri }}>
      {children}
    </ProfileContext.Provider>
  );
};
