const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const multiparty = require('multiparty');
const fs = require("fs");

// 处理主页的请求
const Home = {
  // GET /
  index: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    let customers = await Models.Customer.find({status: 5})
    return res.render('contents/hello', {
      title: '数据中心',
      user: JSON.parse(req.session.user),
      customers
    })
  },
  // GET /account
  getAccount: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    Models.User.find({}, (err, users)=>{
      return res.render('contents/account', {
        title: '顾问团队账号管理',
        user: JSON.parse(req.session.user),
        users
      })
    })
  },
  // GET /product
  getProduct: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    Models.Product.find({}, (err, products)=>{
      return res.render('contents/product', {
        title: '产品管理',
        user: JSON.parse(req.session.user),
        products
      })
    })
  },
  // POST /newProduct
  createProduct: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    req.body.createAt = new Date()
    req.body.creater = JSON.parse(req.session.user).name

    Models.Product(req.body).save(err=>{
      return res.redirect('/product')
    })
  },
  // POST /changeProduct
  changeProduct: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    var id = req.body.id
    delete req.body.id
    req.body.changeAt = new Date()
    req.body.changer = JSON.parse(req.session.user).name

    Models.Product.findByIdAndUpdate(id, req.body, (err)=>{
      return res.redirect('/product')
    })
  },
  // POST /getProduct
  getProductByAjax: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    Models.Product.findById(req.body.id, (err, product)=>{
      return res.json(product)
    })
  },
};

module.exports = Home;
