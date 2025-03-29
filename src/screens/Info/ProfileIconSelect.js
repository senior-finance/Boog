import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProfileContext } from './ProfileContext';

const iconList = [
  require('../../assets/icon1.png'),
  require('../../assets/icon2.png'),
  require('../../assets/icon3.png'),
  // 나머지 아이콘 추가
];

const ProfileIconSelect = ({ navigation }) => {
  const { setProfileUri } = useContext(ProfileContext);

  const handleSelect = (icon) => {
    const resolvedUri = Image.resolveAssetSource(icon).uri;
    setProfileUri(resolvedUri);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 추가 */}
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <FlatList
        data={iconList}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.iconBox}>
            <Image source={item} style={styles.iconImage} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  iconBox: {
    width: '30%',
    margin: '1.66%',
    alignItems: 'center',
  },
  iconImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 50,
    alignItems: 'left',
    justifyContent: 'center',
  },
});

export default ProfileIconSelect;
