const config = {
  whitelist: null,
  ddosConfig: {
    burst: 100,
    limit: 100,
  },
  roles: ['ADMIN', 'USER'],
  status: ['ACTIVE', 'BLOCKED', 'DELETED', 'PENDING'],
};

module.exports = config;
