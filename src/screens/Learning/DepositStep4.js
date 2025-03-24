import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function DepositStep4({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        송금 연습을 해볼게요{'\n'}실제로 송금이 되지는 않아요!
      </Text>

      <Text style={styles.subtitle}>
        입금할 계좌, 은행, 금액을{'\n'}
        확인해주세요
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>계좌 : {route.params.accountNumber}</Text>
        <Text style={styles.infoText}>은행 : {route.params.selectedBank}</Text>
        <Text style={styles.infoText}>금액 : {route.params.amount}원</Text>
      </View>

      {/* 모의 입금 버튼 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>모의 송금하기</Text>
      </TouchableOpacity>

      {/* 팝업 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>잘하셨어요! 👏</Text>
            <Text style={styles.modalSubtitle}>연습하면서 도움이 필요하셨나요?</Text>

            {/* 버튼들 */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>도움</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('DepositStep1'); // 다시 연습 버튼 → DepositStep1 이동
                }}
              >
                <Text style={styles.modalButtonText}>다시 연습</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setModalVisible(false); // 모달 닫기
                navigation.navigate('Main'); // 홈화면 이동
              }}
            >
              <Text style={styles.modalButtonText}>홈화면</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    backgroundColor: '#F7F5F0', 
    paddingHorizontal: 20, 
    paddingTop: 80 
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 50 
  },
  subtitle: { 
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center', 
    marginBottom: 40 
  },
  infoBox: { 
    width: '80%', 
    padding: 20, 
    backgroundColor: '#CADEF4', 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: 'gray', 
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    marginBottom: 40 
  },
  infoText: { 
    fontSize: 23, 
    fontWeight: 'bold',
    color: 'black', 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#F9EA97', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 30,
    borderWidth: 2, 
    borderColor: 'black',
  },
  buttonText: { 
    fontSize: 25, 
    fontWeight: 'bold',
    color: 'black', 
  },
  // 팝업 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: { 
    width: '90%',
    backgroundColor: '#FCFCFC',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  modalTitle: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10
  },
  modalSubtitle: { 
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 30 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 15 
  },
  modalButton: { 
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  modalButtonText: { 
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold' 
  }
});