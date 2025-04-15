import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import CustomText from '../../components/CustomText';

export default function DepositStep4({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>
        입금 연습을 해볼게요{'\n'}실제로 입금이 되지는 않아요!
      </CustomText>

      <CustomText style={styles.subtitle}>
        입금할 계좌, 은행, 금액을{'\n'}
        확인해주세요
      </CustomText>

      <View style={styles.infoBox}>
        <CustomText style={styles.infoText}>계좌 : {route.params.accountNumber}</CustomText>
        <CustomText style={styles.infoText}>은행 : {route.params.selectedBank}</CustomText>
        <CustomText style={styles.infoText}>금액 : {route.params.amount}원</CustomText>
      </View>

      {/* 모의 입금 버튼 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setModalVisible(true)}
      >
        <CustomText style={styles.buttonText}>모의 입금하기</CustomText>
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
            <CustomText style={styles.modalTitle}>잘하셨어요! 👏</CustomText>
            <CustomText style={styles.modalSubtitle}>연습하면서 도움이 필요하셨나요?</CustomText>

            {/* 버튼들 */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.modalButton}>
                <CustomText style={styles.modalButtonText}>도움</CustomText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('DepositStep1'); // 다시 연습 버튼 → DepositStep1 이동
                }}
              >
                <CustomText style={styles.modalButtonText}>다시 연습</CustomText>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setModalVisible(false); // 모달 닫기
                navigation.navigate('MainTabs'); // 홈화면 이동
              }}
            >
              <CustomText style={styles.modalButtonText}>홈화면</CustomText>
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
    backgroundColor: '#F5F5F5', 
    paddingHorizontal: 20, 
    paddingTop: 80 
  },
  title: { 
   // fontSize: 28, 
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 50 
  },
  subtitle: { 
   //     fontWeight: 'bold',
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
   // fontSize: 23, 
    fontWeight: 'bold',
    color: 'black', 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#D9D9D9', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: { 
   // fontSize: 25, 
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
  },
  modalTitle: { 
   // fontSize: 28, 
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10
  },
  modalSubtitle: { 
   //     fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 30 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 20 
  },
  modalButton: { 
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalButtonText: { 
   //     color: 'black',
    fontWeight: 'bold' 
  }
});