import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HelpTooltipButton from '../../components/HelpTooltipButton';

export default function DepositStep4({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <CustomText style={styles.title}>
            입금 연습을 해볼게요{'\n'}실제로 입금이 되지는 않아요!
          </CustomText>

          <CustomText style={styles.subtitle}>
            입금할 계좌, 은행, 금액을{'\n'}확인해주세요
          </CustomText>

          <View style={styles.infoBox}>
            <CustomText style={styles.infoText}>계좌 : {route.params.accountNumber}</CustomText>
            <CustomText style={styles.infoText}>은행 : {route.params.selectedBank}</CustomText>
            <CustomText style={styles.infoText}>금액 : {route.params.amount}원</CustomText>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setModalVisible(true)}
          >
            <CustomText style={styles.nextButtonText}>모의 입금하기</CustomText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <HelpTooltipButton navigation={navigation} />

      {/* 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
          <View style={styles.iconRow}>
            <Icon name="thumb-up-outline" size={28} color="#4B7BE5" style={{ marginRight: 8, paddingBottom: 5 }} />
            <CustomText style={styles.modalTitle}>잘하셨어요!</CustomText>
          </View>

            <CustomText style={styles.modalSubtitle}>
              연습하면서 도움이 필요하셨나요?
            </CustomText>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('DepositStep1');
                }}
              >
                <CustomText style={styles.modalButtonText}>다시 연습</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('MainTabs');
                }}
              >
                <CustomText style={styles.modalButtonText}>홈화면</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 34,
  },
  subtitle: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  infoBox: {
    width: '100%',
    padding: 20,
    backgroundColor: '#D9E7F9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
    marginBottom: 36,
  },
  infoText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 6,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#4B7BE5',
  },
  nextButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
