const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const UserSchema = new Schema({
  openid: {
    type: String,
    required: true
  },
  wxinfo: {
    nickname: String,
    gender: Number,
    avatarUrl: String,
    country: String,
    province: String,
    city: String,
  },
  userInfo: {
    name: String,
    job: String,
    mobile: String,
    company: String,
    email: String,
    port: String,
    status: Number,
  }
});

//数据模型
const WxUser = mongoose.model('WxUser', UserSchema)

module.exports = WxUser;
