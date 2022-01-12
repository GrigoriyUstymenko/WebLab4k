const app = require('express')();

app.get('/api/getOptions', (req, res) => {
  const items = require('./options.json');
  res.status(200);
  res.json(items);
});
module.exports = app;
