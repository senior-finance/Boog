import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Marker } from "./map";
import {
  PermissionsAndroid,
  Platform,
  View,
  FlatList,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import axios from "axios";
import Geolocation from 'react-native-geolocation-service';
import CustomText from '../../components/CustomText';
import CustomModal from '../../components/CustomModal';
import { MAP_SEARCH_BACKEND_URL } from '@env';

const MapViewScreen = ({ route, navigation }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAppNotFoundModalVisible, setAppNotFoundModalVisible] = useState(false);
  const [isNoPlaceSelectedModalVisible, setNoPlaceSelectedModalVisible] = useState(false);
  const [isLocationGranted, setIsLocationGranted] = useState(false);

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [locationDeniedModalVisible, setLocationDeniedModalVisible] = useState(false);
  const [locationBlockedModalVisible, setLocationBlockedModalVisible] = useState(false);

  const mapView = useRef(null);
  const Divider = () => <View style={{ height: 1, backgroundColor: '#dcdcdc', width: '100%' }} />;

  const handleNavigatePress = () => {
    if (!selectedPlace) {
      setNoPlaceSelectedModalVisible(true);
      return;
    }
    setIsModalVisible(true);
  };

  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };


  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') {
      setIsLocationGranted(true);
      getCurrentLocation();
      return;
    }

    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (hasPermission) {
        setIsLocationGranted(true);
        getCurrentLocation();
        return;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsLocationGranted(true);
        getCurrentLocation();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setLocationBlockedModalVisible(true);
      } else {
        setLocationDeniedModalVisible(true);
      }
    } catch (err) {
      console.warn('위치 권한 요청 실패:', err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
        setLocationDeniedModalVisible(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (userLocation && isLocationGranted) {
      fetchSearchResults('은행');
    }
  }, [userLocation, isLocationGranted]);

  useEffect(() => {
    if (userLocation) {
      const newCenter = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: zoomLevel,
      };
      setMapCenter(newCenter);
      mapView.current?.animateToCoordinate(
        { latitude: newCenter.latitude, longitude: newCenter.longitude },
        500
      );
    }
  }, [userLocation, zoomLevel]);

  const fetchSearchResults = async (keyword) => {
    if (!userLocation || !isLocationGranted) return;
    try {
      const res = await axios.post(`${MAP_SEARCH_BACKEND_URL}searchPlace`, {
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
      setZoomLevel(calculateZoomLevel(uniquePlaces));
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  const removeDuplicatesByNameAndAddress = (places) => {
    const seen = new Set();
    return places.filter(place => {
      const key = place.address;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

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
              setValue={(val) => {
                setSelectedCategory(val);
              }}
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
              setSelectedPlace(null); //  선택 초기화
              fetchSearchResults(selectedCategory);
            }}
          >
            <CustomText style={{ color: 'white', fontWeight: '600', fontSize: 20, lineHeight: 30 }}>검색</CustomText>
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
              image={require('../../assets/marker-user.png')}
              width={60}
              height={60}
              caption={{ text: '내 위치', align: Align.Top }}
              onClick={() => {
                if (mapView.current) {
                  mapView.current.animateToCoordinate(
                    {
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    },
                    500
                  );
                }
              }}
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
              image={require('../../assets/marker-blue.png')}
              width={60}
              height={60}
              caption={{ text: place.placeName, align: Align.Top }}
              onClick={() => {
                if (mapView.current) {
                  mapView.current.animateToCoordinate(
                    {
                      latitude: parseFloat(place.mapy),
                      longitude: parseFloat(place.mapx),
                    },
                    500
                  );
                }
                setSelectedPlace(place);
              }}
            />
          ))}
        </NaverMapView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#4B7BE5',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={handleNavigatePress}
        >
          <CustomText style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>길찾기</CustomText>
        </TouchableOpacity>
      </View>

      <Divider />

      {/* 검색 결과 리스트 */}
      <View style={{ flex: 3, backgroundColor: '#fff', padding: 10 }}>
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const distance = userLocation ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, item.mapy, item.mapx) : null;
            const isSelected = selectedPlace?.address === item.address;
            return (
              <Pressable
                onPress={() => {
                  if (isSelected) {
                    setSelectedPlace(null); // 이미 선택된 항목 다시 누르면 해제
                  } else {
                    setSelectedPlace(item);
                    if (mapView.current) {
                      mapView.current.animateToCoordinate(
                        {
                          latitude: parseFloat(item.mapy),
                          longitude: parseFloat(item.mapx),
                        },
                        500
                      );
                    }
                  }
                }}
                style={({ pressed }) => [
                  {
                    marginBottom: 10,
                    backgroundColor: isSelected ? '#dce7ff' : '#f9f9f9',
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
                  <CustomText style={{ fontWeight: 'bold', fontSize: 16, color: '#4B7BE5' }}>
                    {item.placeName}
                  </CustomText>
                  {distance && (
                    <CustomText style={{ fontSize: 14, color: '#555' }}>{distance} km</CustomText>
                  )}
                </View>
                <CustomText style={{ color: '#333', marginTop: 4 }}>{item.address}</CustomText>
              </Pressable>
            );
          }}
        />
      </View>
      <CustomModal
        visible={isNoPlaceSelectedModalVisible}
        title="장소를 선택하세요"
        message={`먼저 이동할 장소를 선택해주세요.`}
        buttons={[
          {
            text: '확인',
            onPress: () => setNoPlaceSelectedModalVisible(false),
            color: '#4B7BE5',
          },
        ]}
      />

      <CustomModal
        visible={isModalVisible}
        title={selectedPlace?.placeName || '장소 정보'}
        message={`선택한 장소로 길찾기를 하시겠습니까?`}
        buttons={[
          {
            text: '취소',
            onPress: () => setIsModalVisible(false),
            color: '#ccc',
            textColor: 'black',
          },
          {
            text: '확인',
            onPress: () => {
              if (userLocation && selectedPlace) {
                const { latitude, longitude } = userLocation;
                const destLat = selectedPlace.mapy;
                const destLng = selectedPlace.mapx;
                const naverMapUrl = `nmap://route/walk?slat=${latitude}&slng=${longitude}&sname=내+위치&dlat=${destLat}&dlng=${destLng}&dname=${encodeURIComponent(selectedPlace.placeName)}`;
                Linking.openURL(naverMapUrl).catch(() => {
                  setAppNotFoundModalVisible(true);
                });
              }
              setIsModalVisible(false);
            },
            color: '#4B7BE5',
          },
        ]}
      />

      <CustomModal
        visible={isAppNotFoundModalVisible}
        title="네이버 지도 앱 없음"
        message={`네이버 지도 앱이 설치되어 있지 않습니다.
플레이스토어로 이동하시겠습니까?`}
        buttons={[
          {
            text: '닫기',
            onPress: () => setAppNotFoundModalVisible(false),
            color: '#ccc',
            textColor: 'black',
          },
          {
            text: '스토어 이동',
            onPress: () => {
              setAppNotFoundModalVisible(false);
              Linking.openURL('https://play.google.com/store/apps/details?id=com.nhn.android.nmap');
            },
            color: '#4B7BE5',
          },
        ]}
      />
      <CustomModal
        visible={locationDeniedModalVisible}
        title="위치 권한 거부됨"
        message="이 기능을 사용하려면 위치 권한이 필요합니다."
        buttons={[{ text: '메뉴로 이동', onPress: () => navigation.navigate('FunctionScreen'), color: '#4B7BE5' }]}
      />
      <CustomModal
        visible={locationBlockedModalVisible}
        title="위치 권한 차단됨"
        message={`위치 권한이 영구적으로 거부되었습니다.
설정에서 수동으로 권한을 허용해주세요.`}
        buttons={[
          { text: '메뉴로 이동', onPress: () => navigation.navigate('FunctionScreen'), color: '#ccc', textColor: 'black', },
          { text: '설정 이동', onPress: () => Linking.openSettings(), color: '#4B7BE5' }
        ]}
      />
    </View>
  );
};

export default MapViewScreen;