import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from './CustomText';

const HelpTooltipButton = ({ navigation }) => {
  const tooltipAnim = useRef(new Animated.Value(20)).current;
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(tooltipAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.floatingWrapper}>
      <Animated.View
        style={[
          styles.tooltip,
          {
            transform: [{ translateY: tooltipAnim }],
            opacity: tooltipOpacity,
          },
        ]}
      >
        <CustomText style={styles.tooltipText}>도움이 필요하신가요?</CustomText>
      </Animated.View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('VoiceInput')}
      >
        <Icon name="chat-question-outline" size={32} color="#F5F5F5" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    alignItems: 'flex-start',
  },
  tooltip: {
    backgroundColor: '#D9E7F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tooltipText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4B7BE5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HelpTooltipButton;