const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {DateTime}= require('luxon');
const jwt = require('jwt-simple');
const {roles, status} = require('../../../config');

const jwtSecret = process.env.JWT_SECRET;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_INTERVAL;

const userSchema = new mongoose.Schema({
  first_name: {type: String},
  last_name: {type: String},
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  role: {
    default: 'USER',
    enum: roles,
    type: String,
  },
  sessions: [
    {
      access_token: {type: String},
      client_type: {type: String},
      created_at: {
        default: DateTime.local().toSeconds(),
        type: Number,
      },
      device_token: {type: String},
      is_active: {
        default: true,
        type: String,
      },
      refresh_token: {type: String},
    },
  ],
  status: {
    default: 'ACTIVE',
    enum: status,
    type: String,
  },
  created_at: {
    default: Date.now,
    type: Number,
  },
  updated_at: {
    default: Date.now,
    type: Number,
  },
  verify_tokens: {
    email: {
      default: '',
      type: String,
    },
    reset_password: {
      default: '',
      type: String,
    },
  },
});

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.method.passwordMatches = async (password) => {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.method.token = () => {
  const date = DateTime.local();
  const payload = {
    _id: this._id,
    exp: date.plus({minutes: jwtExpirationInterval}).toSeconds(),
    iat: date.toSeconds(),
  };
  return jwt.encode(payload, jwtSecret);
};

const User = mongoose.model('User', userSchema);

User.createIndexes({
  first_name: 1,
  last_name: 1,
});

module.exports = User;
