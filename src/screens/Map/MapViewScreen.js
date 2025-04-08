import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Marker } from "./map";
import {
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';

import { MAP_SEARCH_BACKEND_URL } from '@env';

const MapViewScreen = ({ route, navigation }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('은행');
  const [categoryItems, setCategoryItems] = useState([
    { label: '가장 가까운 은행', value: '은행' },
    { label: 'KB국민은행', value: 'KB국민은행' },
    { label: '신한은행', value: '신한은행' },
    { label: '우리은행', value: '우리은행' },
    { label: '하나은행', value: '하나은행' },
    { label: 'IBK기업은행', value: 'IBK기업은행' },
  ]);

  const [searchResults, setSearchResults] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [mapCenter, setMapCenter] = useState({
    latitude: 37.554347,
    longitude: 127.011001,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);
  const mapView = useRef(null);
  const Divider = () => (
    <View style={{ height: 1, backgroundColor: '#dcdcdc', width: '100%' }} />
  );

  // 위치 권한 요청
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error("사용자 위치 가져오기 실패:", error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  // 현재 위치가 준비되면 검색 실행
  useEffect(() => {
    if (userLocation) {
      fetchSearchResults('은행');
    }
  }, [userLocation]);

  // 사용자 위치를 지도 중앙으로 설정
  useEffect(() => {
    if (userLocation) {
      const newCenter = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: zoomLevel,
      };
      setMapCenter(newCenter);
      if (mapView.current) {
        mapView.current.animateToCoordinate(
          { latitude: newCenter.latitude, longitude: newCenter.longitude },
          500
        );
      }
    }
  }, [userLocation, zoomLevel]);

  // 장소 검색 요청
  const fetchSearchResults = async (keyword) => {
    if (!userLocation) return;

    try {

      // const res = await axios.post(`${MAP_SEARCH_BACKEND_URL}searchPlace`, {
      //   placeName: keyword,
      //   x: userLocation.longitude,
      //   y: userLocation.latitude,
      // });

      const res = await axios.post('http://10.0.2.2:4000/searchPlace', {
        placeName: keyword,
        x: userLocation.longitude,
        y: userLocation.latitude,
      });

      const placesData = res.data.places.map((place) => ({
        placeName: place.placeName || '이름 없음',
        address: place.address || '주소 없음',
        mapx: place.mapx,
        mapy: place.mapy,
      }));

      const uniquePlaces = removeDuplicatesByNameAndAddress(placesData);
      setSearchResults(uniquePlaces);

      const newZoom = calculateZoomLevel(uniquePlaces);
      setZoomLevel(newZoom);

      if (userLocation && mapView.current) {
        mapView.current.animateToCoordinate(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          500
        );
      }
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  // 결과 리스트에서 주소 중복 제거
  const removeDuplicatesByNameAndAddress = (places) => {
    const seen = new Set();
    return places.filter(place => {
      const key = place.address;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // 현재 위치와 은행 위치 거리 계산 (km)
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  // 거리 기반 zoom 수치 계산
  const calculateZoomLevel = (places) => {
    if (places.length <= 1) return 16;

    const latitudes = places.map(p => p.mapy);
    const longitudes = places.map(p => p.mapx);
    const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

    const distances = places.map(p => {
      const dx = p.mapx - avgLng;
      const dy = p.mapy - avgLat;
      return Math.sqrt(dx * dx + dy * dy);
    });

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;

    if (avgDistance < 0.001) return 17;
    if (avgDistance < 0.002) return 16;
    if (avgDistance < 0.004) return 15;
    if (avgDistance < 0.008) return 14;
    if (avgDistance < 0.015) return 13;
    if (avgDistance < 0.03) return 12;
    return 11;
  };

  // 위치 권한 요청 함수
  async function requestLocationPermission() {
    if (Platform.OS !== 'android') return;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '현재 위치를 표시하려면 위치 권한이 필요합니다.',
          buttonNeutral: '나중에 묻기',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('위치 권한이 허용되었습니다.');
      } else {
        console.log('위치 권한이 거부되었습니다.');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 드롭다운 & 검색 버튼 */}
      <View style={{ flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', paddingHorizontal: 10, zIndex: 1000 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 8 }}>
            <DropDownPicker
              open={open}
              value={selectedCategory}
              items={categoryItems}
              setOpen={setOpen}
              setValue={setSelectedCategory}
              setItems={setCategoryItems}
              placeholder="카테고리 선택"
              containerStyle={{ height: 44 }}
              style={{ backgroundColor: '#fff', borderColor: '#4B7BE5', borderRadius: 8, height: 44 }}
              dropDownContainerStyle={{ backgroundColor: '#f9f9f9', borderColor: '#4B7BE5', borderRadius: 8 }}
              textStyle={{ fontSize: 20, color: '#333' }}
              labelStyle={{ fontWeight: '500' }}
              listItemContainerStyle={{ borderBottomColor: '#d0d0d0', borderBottomWidth: 1 }}
            />
          </View>
          <TouchableOpacity
            style={{
              flex: 2,
              height: 50,
              backgroundColor: '#4B7BE5',
              marginLeft: 10,
              marginTop: 6,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => {
              console.log('선택된 카테고리:', selectedCategory);
              fetchSearchResults(selectedCategory);
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 20, lineHeight: 30 }}>검색</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Divider />

      {/* 지도 영역 */}
      <View style={{ flex: 6 }}>
        <NaverMapView
          ref={mapView}
          style={{ width: '100%', height: '100%' }}
          showsMyLocationButton={true}
          center={mapCenter}
          useTextureView
        >
          {/* 내 위치 마커 */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              image={require('../../assets/marker-user')}
              width={60}
              height={60}
              caption={{ text: '내 위치', align: Align.Top }}
            />
          )}
          {/* 검색된 장소 마커 */}
          {searchResults.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(place.mapy),
                longitude: parseFloat(place.mapx),
              }}
              image={require('../../assets/marker-blue')}
              width={60}
              height={60}
              caption={{ text: place.placeName, align: Align.Top }}
            />
          ))}
        </NaverMapView>
      </View>

      <Divider />

      {/* 검색 결과 리스트 */}
      <View style={{ flex: 3, backgroundColor: '#fff', padding: 10 }}>
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const distance = userLocation ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, item.mapy, item.mapx) : null;
            return (
              <Pressable
                onPress={() => {
                  if (mapView.current) {
                    mapView.current.animateToCoordinate(
                      {
                        latitude: parseFloat(item.mapy),
                        longitude: parseFloat(item.mapx),
                      },
                      500
                    );
                  }
                }}
                style={({ pressed }) => [
                  {
                    marginBottom: 10,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#4B7BE5',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  },
                  pressed && {
                    backgroundColor: '#e0ecff',
                    borderColor: '#3A66D1',
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#4B7BE5' }}>
                    {item.placeName}
                  </Text>
                  {distance && (
                    <Text style={{ fontSize: 14, color: '#555' }}>{distance} km</Text>
                  )}
                </View>
                <Text style={{ color: '#333', marginTop: 4 }}>{item.address}</Text>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

export default MapViewScreen;