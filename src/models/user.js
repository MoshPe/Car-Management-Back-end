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
    versionKey: false,
  }
);

// UserSchema.pre('save', (next) => {
//   this.Treatment_Number = this._id;
//   next();
// });

module.exports = mongoose.model('User', UserSchema, 'users');
