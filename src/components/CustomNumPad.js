import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

// 기본 키패드 배열
// 
const DEFAULT_KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['000', '0'],
  [], [], [],
  ['모두 지우기', '한칸 지우기',],
];

export default function CustomNumPad({
  onPress,
  keyRows = DEFAULT_KEY_ROWS,  // 화면에서 전달된 배열이 없으면 기본값 사용
  textStyle = {},           // ① 외부에서 넘어올 텍스트 스타일
}) {
  return (
    <View style={styles.container}>
      {keyRows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, colIndex) => {
            const reactKey = `r${rowIndex}-c${colIndex}`;  // 유니크 키
            if (!key) {
              return <View key={reactKey} style={styles.placeholder} />;
            }
            return (
              <TouchableOpacity
                key={reactKey}
                style={styles.button}
                onPress={() => onPress(key)}
              >
                <Text style={[styles.buttonTextp, textStyle]}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#E0F7FF',
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  button: {
    flex: 1,
    marginHorizontal:10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#rgb(158, 232, 255)',
    borderWidth: 2,
    borderColor: '#rgb(130, 142, 255)',
    shadowColor: '#00BFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
});
