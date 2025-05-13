import React from 'react';
import { Text } from 'react-native';
import { useFontSize } from '../screens/Info/FontSizeContext';

const CustomText = ({ children, style, ...props }) => {
  const { fontSize } = useFontSize();
  return (
    <Text
      style={[
        {
          fontSize,
          flexWrap: 'wrap',         // ✅ 줄바꿈 허용
          textAlignVertical: 'center', // ✅ 안드로이드에서 수직 정렬
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
