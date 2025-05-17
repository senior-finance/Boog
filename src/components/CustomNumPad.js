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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 80,            // 원하는 높이로 조정
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 5,
    borderRadius: 50,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '800',
  },
  placeholder: {
    flex: 1,
    marginHorizontal: 5,
    // 보이지 않지만 자리 차지
    backgroundColor: 'transparent',
  },
});
