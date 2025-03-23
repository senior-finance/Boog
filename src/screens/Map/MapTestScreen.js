import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';

const MapTestScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>네이버 지도 테스트</Text>
      <NaverMapView
        style={styles.map}
        center={{ latitude: 37.5665, longitude: 126.9780, zoom: 14 }} // 서울 좌표
      >
        <Marker coordinate={{ latitude: 37.5665, longitude: 126.9780 }} />
      </NaverMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 300, // 지도 크기 조정
  },
});

export default MapTestScreen;