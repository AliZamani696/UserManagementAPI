const mongoose = require('mongoose');

class AppConfig {
    constructor() {
        this.port = 9090;
        this.dbUri =
            'mongodb://root:123@172.20.6.7:27017/userManageApi?authSource=admin';
    }

    connectDB = async () => {
        try {
            console.log('در حال تلاش برای اتصال به:', this.dbUri);

            await mongoose.connect(this.dbUri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log(' با موفقیت به MongoDB متصل شدیم!');
        } catch (error) {
            console.error(' خطا در هنگام اتصال اولیه:');
            console.error(error.message);
            process.exit(1);
        }
    };

    checkConnection = () => {
        return mongoose.connection.readyState === 1;
    };
}

module.exports = new AppConfig();
