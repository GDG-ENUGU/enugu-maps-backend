const bcyrpt = require('bcrypt');
const httpStatus = require('http-status');
const {DateTime} = require('luxon');
const uuidv4 = require('uuid/v4');
const jwt = require('jwt-simple');

const {User} = require('./model');
const {generateToken} = require('./utils');
const {Error} = require('../../../utils/api-response');


const register = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email, password,
    } = req.body;

    const isEmailExists = await User.findOne({email});

    if (isEmailExists) {
      throw new Error({
        message: 'Email address is already exists.',
        status: httpStatus.CONFLICT,
      });
    }

    await new User({
      email,
      'first_name': firstName,
      'last_name': lastName,
      'password': password,
    }).save();

    res.status(httpStatus.CREATED).json();
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      email, password,
    } = req.body;

    const user = await User.findOne(
        {email},
        {
          _id: 1,
          email: 1,
          first_name: 1,
          last_name: 1,
          password: 1,
          role: 1,
          sessions: 1,
          status: 1,
        }
    );

    const passwordMatches = await user.passwordMatches(password);

    if (!user || !passwordMatches) {
      throw new Error({
        message: 'Credentials did not match',
        status: httpStatus.CONFLICT,
      });
    }

    if (!user.is_verified) {
      throw new Error({
        message: 'Your email address is not verified.',
        status: httpStatus.NOT_ACCEPTABLE,
      });
    }

    if (user.status == 'BLOCKED') {
      throw new Error({
        message: 'Your account has been suspended by admin',
        status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      });
    }

    if (user.status == 'DELETED') {
      throw new Error({
        message: 'You have deleted your account. Please sign up to continue',
        status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      });
    }

    const token = await generateToken(user);

    res.set('authorization', token.accessToken);
    res.set('x-refresh-token', token.refreshToken);
    res.set('x-token-expiry-time', token.expiresIn);
    res.status(httpStatus.OK);

    return res.json({
      _id: user._id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      token: token.accessToken,
    });
  } catch (errror) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const {refreshToken} = req.body;

    const user = await User.findOne({
      sessions: {
        $elemMatch: {
          is_active: true,
          refresh_token: refreshToken,
        },
      },
    });

    if (!user) {
      throw new Error({
        message: 'Refresh token did not match',
        status: httpStatus.CONFLICT,
      });
    }
    const refreshTokenKey = uuidv4() + user._id;

    await User.updateOne(
        {
          '_id': user._id,
          'sessions.refresh_token': refreshToken,
        },
        {
          'sessions.$.refresh_token': refreshTokenKey,
          'sessions.$.updated_at': DateTime.local().toSeconds(),
        }
    );

    const expiresIn = DateTime.local()
        .plus({minutes: jwtExpirationInterval})
        .toSeconds();

    res.set('authorization', user.token());
    res.set('x-refresh-token', refreshTokenKey);
    res.set('x-token-expiry-time', expiresIn);

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  register,
  login,
  refreshToken,
};

