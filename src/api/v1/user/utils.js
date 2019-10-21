const uuidv4 = require('uuid/v4');

const JWT_EXPIRY = process.env.JWT_EXPIRATION_INTERVAL;

const generateToken = async (user) => {
  const refreshToken = uuidv4() + user._id;

  user.sessions = [
    ...user.session,
    {
      ...deviceInfo,
      access_token: user.token(),
      created_at: DateTime.local().toSeconds(),
      is_active: true,
      refresh_token: refreshToken,
    },
  ];

  user.save();

  const expiresIn = DateTime.local()
      .plus({minutes: JWT_EXPIRY})
      .toSeconds();

  return {
    access_token: user.token(),
    expiresIn,
    refreshToken,
  };
};


module.exports = {
  generateToken,
};
