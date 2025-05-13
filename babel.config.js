module.exports = {
   presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      // 여기에서 "react-native-dotenv"가 아니라
      // "module:react-native-dotenv"라고 적어야 합니다.
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        // 필요에 따라 다른 옵션도 추가/수정 가능
        // allowlist: null,
        // blocklist: null,
        // safe: false,
        // allowUndefined: true,
             },
    ],
  ],
};