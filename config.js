 function getConfig() {
  const env = process.env.ENV;

  switch (env) {
    case 'prod':
      return {
        ApiUrl: ''
      };
    default:
      return {
        ApiUrl: 'http://localhost:5000/api',
      }
  }
}

module.exports = getConfig();
