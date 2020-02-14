const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  createAt: Date,
  updateAt: Date,
  creator: String,
  creatorId: String,
  products: [
    {type: String}
  ],
  cooperators: [
    {type: String}
  ],
  companyInfo: {
    introduction: String,
    website: String,
    products: String,
    address: String,
    contact: String,
    telephone: String,
  },
  monthCost: Number,
  contract: {
    begin: Date,
    end: Date
  },
  words: [
    {
      time: Date,
      user: String,
      userId: String,
      words: String,
      file: {
        name: String,
        path: String
      }
    }
  ],
  logs: [
    {
      time: Date,
      user: String,
      userId: String,
      words: String,
    }
  ],
  status: Number,
});

//数据模型
const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer;
