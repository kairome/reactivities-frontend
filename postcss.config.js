module.exports = {
  plugins: {
    'postcss-import': {
      path: ['./src'],
    },
    'postcss-mixins': {},
    'postcss-nested': {},
    'autoprefixer': {},
    'postcss-custom-media': {},
    'postcss-custom-properties': {
      importFrom: './src/css/colors.css',
      preserve: false,
    },
  },
};
