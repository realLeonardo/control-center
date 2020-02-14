const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const UserPersonSchema = new Schema({
  openid: {
    type: String,
    required: true
  },
  personid: {
    type: String,
    required: true
  },
  createAt: Date
});

//数据模型
const UserPerson = mongoose.model('UserPerson', UserPersonSchema)

module.exports = UserPerson;
