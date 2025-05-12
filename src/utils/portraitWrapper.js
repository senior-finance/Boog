import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function PortraitWrapper({ children }) {
    const { width: screenW, height: screenH } = Dimensions.get('window');
    const isLandscape = screenW > screenH;

    // 가상 캔버스 크기, 숫자 클수록 고해상도
    const DESIGN_W = 500;
    const DESIGN_H = 1000;
    const designRatio = DESIGN_W / DESIGN_H;

    // 1) 캔버스 너비: landscape는 높이 기준, portrait는 화면 가로 기준
    const canvasWidth = isLandscape
        ? screenH * designRatio
        : screenW;
    const canvasHeight = screenH;

    // 2) sidePanel 너비: landscape일 때만 (screenW – canvasWidth)/2
    const sideWidth = isLandscape
        ? (screenW - canvasWidth) / 2
        : 0;

    // 3) 최종 스케일
    const finalScale = canvasWidth / DESIGN_W;

    return (
        <View style={styles.outerRow}>
            {/* 좌측 사이드 (portrait면 width:0, flex:0) */}
            <View style={[
                styles.sidePanel,
                isLandscape
                    ? { flex: 1, width: sideWidth }
                    : { flex: 0, width: 0 }
            ]}>
                <Text style={styles.sideText}>📐 사이드 패널</Text>
                <Text style={styles.sideText}>이 곳은 사이드 패널이에요</Text>
            </View>

            {/* 가운데 캔버스 */}
            <View style={[styles.centerPanel, { width: canvasWidth }]}>
                <View
                    style={{
                        width: DESIGN_W,
                        height: DESIGN_H,
                        transform: [{ scale: finalScale }],
                    }}
                >
                    {children}
                </View>
            </View>

            {/* 우측 사이드 */}
            <View style={[
                styles.sidePanel,
                isLandscape
                    ? { flex: 1, width: sideWidth }
                    : { flex: 0, width: 0 }
            ]}>
                <Text style={styles.sideText}>🎨 디자인 삽입</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerPanel: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    sideText: {
        fontSize: 18,
        color: '#888',
    },
});