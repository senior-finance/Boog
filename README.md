![SOPIE Senior Of Finance   artificial IntelligEnce (2)](https://github.com/user-attachments/assets/dcbdffbf-28cb-486d-8013-43c76302d447)

vscode에서 Git 리포지토리 복제 (https://github.com/Eojin61/](https://github.com/senior-finance/Boog.git)

npm install react-native-nmap --legacy-peer-deps  명령어 실행

실행이 완료되면 node_modules 폴더 생김. 실행 안하면 안생김

node_modules/react-native-nmap/android/build.gradle 에서 밑의내용으로 복붙

````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
apply plugin: 'com.android.library'

buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.4.1'
    }
}

android {
    compileSdkVersion rootProject.ext.hasProperty('compileSdkVersion') ? rootProject.ext.compileSdkVersion : 34
    buildToolsVersion rootProject.ext.hasProperty('buildToolsVersion') ? rootProject.ext.buildToolsVersion : "34.0.0"

    defaultConfig {
        minSdkVersion rootProject.ext.hasProperty('minSdkVersion') ? rootProject.ext.minSdkVersion : 21
        targetSdkVersion rootProject.ext.hasProperty('targetSdkVersion') ? rootProject.ext.targetSdkVersion : 34

        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
   mavenLocal()
   maven {
      // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
      url("$rootDir/../node_modules/react-native/android")
   }
   maven {
      // Android JSC is installed from npm
      url("$rootDir/../node_modules/jsc-android/dist")
   }
    google()
    jcenter()
    mavenCentral()
    maven {
        url 'https://naver.jfrog.io/artifactory/maven/'
        // url 'https://repository.map.naver.com/archive/maven'
    }
}

dependencies {
    implementation 'com.facebook.react:react-native:+'
    implementation "com.naver.maps:map-sdk:${rootProject.ext.hasProperty('mapSdkVersion') ? rootProject.ext.mapSdkVersion : '3.12.0'}"
    implementation "com.google.android.gms:play-services-location:16.0.0"
}

````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

npm install react-native-config --legacy-peer-deps  명령어 실행

프로젝트 폴더 바로 안에 .env 파일 만들고 CLIENT_VALUE=86n98ozqdn 값 넣고 저장 (사진첨부)

그리고 npx react-native start --reset-cache 로 실행

a 눌러서 run on Android 실행시켜주면 앱 설치하고 자동으로 실행시켜줌 -> 컴 사양에 따라 시간 차이 남

env 파일의 내용을 사용하는것을 확인하기 위해 env 파일 내용 수정하고 다시 터미널에서 a 눌러주면 앱 재실행되고 -> 컴 사양에 따라 시간 차이 남
지도가 안켜지는것을 확인할 수 있음 (401에러 client 값 오류)

App.js 파일에서 16번 라인 // console.log(API_TEST.CLIENT_VALUE); 주석 해제하면 로그도 찍어볼 수 있음

````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
