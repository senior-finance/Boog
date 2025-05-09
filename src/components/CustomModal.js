import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

const CustomModal = ({ visible, title, message, buttons }) => {
  if (!visible) return null;

  const renderMessage = () => {
    if (typeof message === 'string') {
      return message.split('\n').map((line, i) => (
        <CustomText
          key={i}
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: '#555',
            marginBottom: 2,
          }}
        >
          {line}
        </CustomText>
      ));
    }
    return message;
  };
  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
    }}>
      <View style={{
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}>
        <CustomText style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
          color: '#4B7BE5',
        }}>
          {title}
        </CustomText>

        <View style={{ marginBottom: 20 }}>
          {renderMessage()}
        </View>

        <View style={{ flexDirection: 'row' }}>
          {buttons.map((btn, i) => (
            <TouchableOpacity
              key={i}
              onPress={btn.onPress}
              style={{
                backgroundColor: btn.color,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginHorizontal: 10,
              }}>
              <CustomText style={{ color: btn.textColor || 'white', fontSize: 16 }}>{btn.text}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CustomModal;
