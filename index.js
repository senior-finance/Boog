/**
 * @format
 */
// 에러 메시지 무시
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.",
    "`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.",
    'ReactImageView: Image source "null" doesn\'t exist',
    'ViewPropTypes will be removed from React Native',
    'new NativeEventEmitter',
]);
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 2. 글로벌 에러 핸들러 (Hermes 대응)
if (global.ErrorUtils) {
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error('잡힌 에러:', error);
    });
}
AppRegistry.registerComponent(appName, () => App);
