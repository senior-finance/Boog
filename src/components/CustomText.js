import React from 'react';
import { Text } from 'react-native';
import { useFontSize } from '../screens/Info/FontSizeContext';

const CustomText = ({ children, style, ...props }) => {
  const { fontSize } = useFontSize();
  return (
    <Text style={[{ fontSize }, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
