import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  View,
  Dimensions,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from './CustomText';

const TOOLTIP_WIDTH = 140;
const TOOLTIP_HEIGHT = 90;
const MARGIN = 12;
const FAB_BOTTOM_MARGIN = 120;
const TOOLTIP_MARGIN_LEFT_OFFSET = 30;

const HelpTooltipButton = () => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  const [dragEnabled, setDragEnabled] = useState(false);
  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - TOOLTIP_WIDTH - MARGIN,
      y: SCREEN_HEIGHT * 0.75,
    })
  ).current;

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: (_, gesture) => {
        const newX = pan.x._offset + gesture.dx;
        const newY = pan.y._offset + gesture.dy;

        const clampedX = Math.max(
          MARGIN,
          Math.min(SCREEN_WIDTH - TOOLTIP_WIDTH - MARGIN + TOOLTIP_MARGIN_LEFT_OFFSET, newX)
        );
        const clampedY = Math.max(
          MARGIN, 
          Math.min(SCREEN_HEIGHT - TOOLTIP_HEIGHT - FAB_BOTTOM_MARGIN, newY)
        );

        pan.x.setValue(clampedX - pan.x._offset);
        pan.y.setValue(clampedY - pan.y._offset);
      },

      onPanResponderRelease: () => {
        pan.flattenOffset();
        setDragEnabled(false);
      },
    })
  ).current;

  // 현재 화면 이름 가져오기
  const getActiveRouteName = (navState) => {
    if (!navState || !navState.routes) return null;
    const route = navState.routes[navState.index];
    return route.state ? getActiveRouteName(route.state) : route.name;
  };

  const currentRouteName = getActiveRouteName(state);
  const hiddenRoutes = ['Login', 'SetUserNameScreen', 'VoiceInput', 'MapView', 'MainTabs', 'Home'];
  if (!currentRouteName || hiddenRoutes.includes(currentRouteName)) return null;

  return (
    <Animated.View
      style={[styles.floatingWrapper, { transform: pan.getTranslateTransform() }]}
      {...(dragEnabled ? panResponder.panHandlers : {})}
    >
      {/* 텍스트 영역 - 항상 드래그 가능 */}
      <View {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.tooltip,
            {
              transform: [{ translateY: tooltipAnim }],
              opacity: tooltipOpacity,
            },
          ]}
        >
          <CustomText style={styles.tooltipText}>챗봇에게 물어보기</CustomText>
        </Animated.View>
      </View>

      {/* 버튼 - 길게 눌렀을 때만 드래그 가능 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('VoiceInput')}
        onLongPress={() => setDragEnabled(true)}
      >
        <Icon name="chat-question-outline" size={35} color="#F5F5F5" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'flex-start',
  },
  tooltip: {
    backgroundColor: 'rgba(217, 231, 249, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    marginLeft: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tooltipText: {
    fontSize: 17,
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