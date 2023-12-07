module.exports = {
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "appointments",
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
}