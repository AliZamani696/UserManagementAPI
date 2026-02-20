const mongoose = require('mongoose');
const config = require('./appConfig');

class AppDatabase {
  connectDB = async () => {
    try {
      await mongoose.connect(config.dbUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('با موفقیت به MongoDB متصل شدیم!');
    } catch (error) {
      console.error('خطا در اتصال:', error.message);
      process.exit(1);
    }
  };
  checkConnection = () => {
    return mongoose.connection.readyState === 1;
  };
}

module.exports = new AppDatabase();
