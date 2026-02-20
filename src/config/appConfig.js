require('dotenv').config();

class AppConfig {
  constructor() {
    this.port = process.env.SERVER_PORT || 9090;
    // const user = process.env.DB_USER_NAME || 'root';
    // const pass = process.env.DB_PASSWORD || '123';
    // const uri = process.env.DB_URI
    //     ? process.env.DB_URI.replace('mongodb://', '')
    //     : '172.20.6.7:27017/';
    // const dbName = process.env.DB_NAME || 'userManageApi';
    // this.dbUri = `mongodb://${user}:${pass}@${uri}${dbName}?authSource=admin`;
    this.dbUri = process.env.DB_URI || 'mongodb://localhost:27017/userManageApi';
  }
}

module.exports = new AppConfig();
