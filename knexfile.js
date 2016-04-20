module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/healthy-home-storage'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }
};
