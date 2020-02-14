const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 站点数据模式
const SiteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dbName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  wxcode: {
    type: String
  },
  kind: Number, // 类型：0 私有，1 公共
  admin: {
    email: String,
    password: String
  },
});

//数据模型
const Site = mongoose.model('Site', SiteSchema)

module.exports = Site;
