import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function PortraitWrapper({ children }) {
    const { width: screenW, height: screenH } = Dimensions.get('window');

    // 가상 캔버스, 숫자 클수록 고해상도, 픽셀 수 증가
    const DESIGN_WIDTH = 500;
    const DESIGN_HEIGHT = 1000;
    const designRatio = DESIGN_WIDTH / DESIGN_HEIGHT;

    // 캔버스 실제 렌더 너비 계산
    const canvasWidth = screenH * designRatio;
    const canvasHeight = screenH;

    // 빈 공간(사이드) 너비
    const sideWidth = Math.max((screenW - canvasWidth) / 2, 0);

    // 스케일 (디자인 → 실제)
    const originalScale = canvasWidth / DESIGN_WIDTH;
    const shrinkFactor = 1;      // 1.0 = 그대로, 0.8 = 80% 등
    const finalScale = originalScale * shrinkFactor;

    return (
        <View style={styles.outerRow}>
            {/* 왼쪽 사이드 */}
            <View style={[styles.sidePanel, { width: sideWidth }]}>
                <Text style={styles.sideText}>이 곳은 사이드 패널이에요</Text>
            </View>

            {/* 가운데 캔버스 */}
            <View style={styles.centerPanel}>
                <View
                    style={{
                        width: DESIGN_WIDTH,
                        height: DESIGN_HEIGHT,
                        transform: [{ scale: finalScale }],
                    }}
                >
                    {children}
                </View>
            </View>

            {/* 오른쪽 사이드 */}
            <View style={[styles.sidePanel, { width: sideWidth }]}>
                <Text style={styles.sideText}>원하는 디자인을 넣어보세요</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    sidePanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerPanel: {
        width: 'auto',
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sideText: {
        fontSize: 18,
        color: '#888',
    },
});