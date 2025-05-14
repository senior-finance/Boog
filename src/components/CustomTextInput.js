import React from 'react';
import { TextInput } from 'react-native';
import { useFontSize } from '../screens/Info/FontSizeContext';

const CustomTextInput = ({ style, onSubmitEditing, ...props }) => {
  const { fontSize } = useFontSize();

  const handleSubmit = (e) => {
    const text = e.nativeEvent?.text ?? '';

    if (typeof onSubmitEditing === 'function') {
      if (onSubmitEditing.length === 1) {
        onSubmitEditing(text);
      } else {
        onSubmitEditing(e);
      }
    }
  };

  return (
    <TextInput
      style={[{ fontSize, padding: 10 }, style]}
      placeholderTextColor="#999"
      onSubmitEditing={handleSubmit}
      {...props}
    />
  );
};

export default CustomTextInput;
