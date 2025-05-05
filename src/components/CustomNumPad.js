import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['000', '0', '지우기'],
  ['모두 지우기', '지우개',],
];

export default function CustomNumPad({onPress}) {
  return (
    <View style={styles.container}>
      {KEY_ROWS.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map(key => (
            <TouchableOpacity
              key={key}
              style={styles.button}
              onPress={() => onPress(key)}>
              <Text style={styles.buttonText}>{key}</Text>
            </TouchableOpacity>
          ))}
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
    marginHorizontal: 4,
    height: 80,            // 원하는 높이로 조정
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: '800',
  },
});
