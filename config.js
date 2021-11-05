 function getConfig() {
  const env = process.env.ENV;

  switch (env) {
    case 'prod':
      return {
        ApiUrl: 'https://kairome-reactivities-backend.herokuapp.com/api'
      };
    default:
      return {
        ApiUrl: 'http://localhost:5000/api',
      }
  }
}

module.exports = getConfig();
