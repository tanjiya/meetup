const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

module.exports.connect = async dsn => mongoose.connect(dsn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
