const User = require('./api/v1/user/model');

const adminUser = new User({
  email: 'admin@enugu-maps.com',
  first_name: 'Nzube',
  last_name: 'Okoye',
  password: 'blahblahblah',
  is_verified: true,
  role: 'ADMIN',
});

const createAdmin = async () => {
  adminUser.save((err) => {
    if (err) {
      console.log(`Admin user already exists...`);
    }
  });
};

module.exports = {
  createAdmin,
};
