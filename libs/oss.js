let database;
const dotenv = require('dotenv');
dotenv.config();

class OssModel {
    async generateUserKey() {
        let data = {
            username: process.env.OSS_USERNAME,
            password: process.env.POSTGRES_PASSWORD
        }
    }

}
module.exports = new OssModel();