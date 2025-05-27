import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DepositStep4({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient colors={['#D8ECFF', '#E9F4FF']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <CustomText style={styles.title}>
              송금 연습을 해볼게요{'\n'}실제로 송금이 되지는 않아요!
            </CustomText>

            <CustomText style={styles.subtitle}>
              송금할 계좌, 은행, 금액을{'\n'}확인해주세요
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
              <CustomText style={styles.nextButtonText}>모의 송금하기</CustomText>
            </TouchableOpacity>
          </View>

          <CustomText style={styles.quitGuide}>연습을 그만두고 싶다면</CustomText>

          <TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('MainTabs')}>
            <View style={styles.quitContent}>
              <Ionicons name="exit-outline" size={26} color="#4B7BE5" style={styles.quitIcon} />
              <CustomText style={styles.quitText}>그만둘래요</CustomText>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

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
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 123, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 50,
  },
  title: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
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
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#AABDDC',
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
  quitGuide: {
    color: '#999',
    marginBottom: 10,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(75, 123, 229, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  quitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  quitText: {
    fontWeight: 'bold',
    color: '#4B7BE5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#4B7BE5',
    textAlign: 'center',
    fontSize: 16,
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
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AABDDC',
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
});