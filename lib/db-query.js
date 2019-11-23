const config = require("./config");
const { Client } = require("pg");

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

const connectionString =
  `postgresql://${config.DB_USER}:${config.DB_PASSWORD}@` +
  `${config.DB_HOST}:${config.DB_PORT}/` +
  `${config.DB_DATABASE}`;

const isProduction = (config.NODE_ENV === "production");

const CONNECTION = {
  connectionString: isProduction ? config.DATABASE_URL : connectionString,
  ssl: isProduction,
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client(CONNECTION);

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  }
};
