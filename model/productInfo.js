const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  cost: String,
  createAt: Date,
  creater: String,
  updateAt: Date,
  updater: String,
  status: Number,
});

//数据模型
const Product = mongoose.model('Product', ProductSchema)

module.exports = Product;
