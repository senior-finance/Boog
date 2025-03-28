import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MenuButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={30} color="#4B7BE5" style={styles.icon} />
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const CustomerServiceScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#F8F8F8', '#ECECEC']} style={styles.container}>
      <Text style={styles.title}>고객센터</Text>

      <MenuButton
        title="자주 묻는 질문"
        icon="help-circle-outline"
        onPress={() => navigation.navigate('FAQ')}
      />

      <MenuButton
        title="1:1 문의하기"
        icon="chatbox-ellipses-outline"
        onPress={() => navigation.navigate('InquiryForm')}
      />

      <MenuButton
        title="내 문의 내역"
        icon="document-text-outline"
        onPress={() => navigation.navigate('InquiryList')}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    marginRight: 20,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default CustomerServiceScreen;
