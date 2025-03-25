import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Marker, Path, Polygon, Polyline } from "./map";
import { Image, ImageBackground, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
//import NaverMapView, { Marker } from 'react-native-nmap';
//import { NavigationContainer } from '@react-navigation/native';

const P0 = { latitude: 37.564362, longitude: 126.977011 };
const P1 = { latitude: 37.565051, longitude: 126.978567 };
const P2 = { latitude: 37.565383, longitude: 126.976292 };
const P4 = { latitude: 37.564834, longitude: 126.977218 };
const P5 = { latitude: 37.562834, longitude: 126.976218 };

// const Tab = createBottomTabNavigator();


// const MapViewScreen = ({ navigation }) => {
const MapViewScreen = () => {
  const mapView = useRef(null);
  const [enableLayerGroup, setEnableLayerGroup] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <>
      <NaverMapView
        ref={mapView}
        style={{ width: '100%', height: '100%' }}
        showsMyLocationButton={true}
        center={{ ...P0, zoom: 16 }}
        useTextureView
      >
        <Marker coordinate={P0} pinColor='green'
        // onClick={() => {
        //     mapView.current.setLayerGroupEnabled(LayerGroup.LAYER_GROUP_BUILDING, enableLayerGroup);
        //     mapView.current.setLayerGroupEnabled(LayerGroup.LAYER_GROUP_TRANSIT, enableLayerGroup);
        //     setEnableLayerGroup(!enableLayerGroup);
        // }}
        // caption={{ text: "test caption", align: Align.Left }}
        />
        <Marker coordinate={P1} pinColor="blue" />
        <Marker coordinate={P2} pinColor="red" />
        {/* <Marker coordinate={P4} image={require("./marker.png")} width={48} height={48} /> */}
        {/* <Path coordinates={[P0, P1]} width={10} /> */}
        {/* <Polyline coordinates={[P1, P2]} />
              <Polygon coordinates={[P0, P1, P2]} color={`rgba(0, 0, 0, 0.5)`} /> */}
        {/* <Marker coordinate={P5}>
                  <View style={{ backgroundColor: 'rgba(255,0,0,0.2)', borderRadius: 80 }}>
                      <Text>Image Marker</Text>
                  </View>
              </Marker> */}
      </NaverMapView>
      {/* <TouchableOpacity style={{ position: 'absolute', bottom: '10%', right: 8 }} onPress={() => navigation.navigate('Learning')}>
              <View style={{ backgroundColor: 'gray', padding: 4 }}>
                  <Text style={{ color: 'white' }}>Go to Learning</Text>
              </View>
          </TouchableOpacity> */}
    </>
  );
};

async function requestLocationPermission() {
  if (Platform.OS !== 'android') return;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Show my location needs Location permission',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default MapViewScreen;