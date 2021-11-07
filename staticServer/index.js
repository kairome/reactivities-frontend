const path = require('path');

const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

const buildPath = path.join(__dirname, '../build');

app.use(express.static(buildPath));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.info(`Listening at http://localhost:${port}\n`);
});
