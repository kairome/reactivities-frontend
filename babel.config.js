const config = {
  presets: [
    ['@babel/preset-env', {
      "useBuiltIns": "entry"
    }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ],
};

module.exports = config;
