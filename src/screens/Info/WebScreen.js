import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomText from '../../components/CustomText';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import loadingJson from '../../assets/loadingg.json';

const WebScreen = ({ route }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <LinearGradient
          colors={['rgba(140, 182, 222, 0.69)', '#e0f0ff']}
          style={styles.loadingContainer}
        >
          <LottieView
            source={loadingJson}
            autoPlay
            loop
            style={{ width: 160, height: 160 }}
          />
        </LinearGradient>
      )}
      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default WebScreen;