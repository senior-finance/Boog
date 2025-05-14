import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from './CustomText';

const HelpTooltipButton = () => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);

  // ✅ 모든 훅은 항상 호출되어야 함
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
      }),
    ]).start();
  }, []);

  // ✅ 렌더링 시점에서만 조건 분기
  if (!state || !state.routes) return null;

  const routes = state.routes;
  const routeName = routes[routes.length - 1]?.name;

  const hiddenRoutes = ['Login', 'SetUserNameScreen', 'VoiceInput', 'MapView'];
  if (hiddenRoutes.includes(routeName)) return null;

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
        onPress={() => navigation.navigate('Guide')}
      >
        <Icon name="chat-question-outline" size={35} color="#F5F5F5" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    zIndex: 100,
    alignItems: 'flex-start',
  },
  tooltip: {
    backgroundColor: 'rgba(217, 231, 249, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
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
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'rgba(75, 123, 229, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HelpTooltipButton;