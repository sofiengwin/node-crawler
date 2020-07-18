module.exports = {
  development: {
      dialect: 'sqlite',
      storage: './db.development.sqlite'
  },
  test: {
      dialect: 'sqlite',
      storage: ':memory:'
  },
  production: {
      use_env_variable:"DB_CONNECTION_STRING",
      dialect: "postgres",
      ssl: true,
      dialectOptions: {
          ssl: true
      }
  }
};