module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'module-resolver', {
        alias: {
          'react-native/Libraries/Components/View/ViewPropTypes':
            'deprecated-react-native-prop-types',
        },
      },
    ],
  ],
};