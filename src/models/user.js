const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    strict: false,
    versionKey: false,
  }
);

module.exports = mongoose.model('User', UserSchema, 'users');
