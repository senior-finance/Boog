// src/components/CustomTextInput.js
import React from 'react';
import { TextInput } from 'react-native';
import { useFontSize } from '../screens/Info/FontSizeContext';

const CustomTextInput = ({ style, ...props }) => {
  const { fontSize } = useFontSize();

  return (
    <TextInput
      style={[{ fontSize, padding: 10 }, style]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

export default CustomTextInput;
