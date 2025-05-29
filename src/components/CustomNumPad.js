import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

// 기본 키패드 배열
// 
const DEFAULT_KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['취소', '0', '지우기'],
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
                <Text style={[styles.buttonText, textStyle]}>{key}</Text>
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
    padding: 12,
    backgroundColor: '#EAF6FF',
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#D6ECFF',
    borderWidth: 1.5,
    borderColor: '#B0D4F1',
    shadowColor: '#2C7BD6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Android 그림자도 줄임
  },
  buttonPressed: {
    backgroundColor: '#B3DBFF',
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontSize: +32,
    fontWeight: '600',
    color: '#1B1B1B',
  },
  placeholder: {
    // 1) 고정 폭으로 공백 주기
    // width: 60,
    // 2) 혹은 flex 로 상대적 크기 조절
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
});
