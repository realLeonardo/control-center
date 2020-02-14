const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const multiparty = require('multiparty');
const fs = require("fs");
const path = require("path");
const FILE_PATH = path.join(__dirname, '../public/file/')

// 处理主页的请求
const Home = {
  // GET /
  index: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    let user = JSON.parse(req.session.user)

    // 获取客户s    
    let customers = await Models.Customer.find({
      $or: [
        {creatorId: user._id}, 
        {
          cooperators: {
            $in: user._id
          }
        }
      ]
    })

    for(let customer of customers){
      let products = []

      // 获取产品名
      for(let id of customer.products){
        let data = await Models.Product.findById(id)
        products.push(data.name)
      }
      customer.productsName = products
    }

    return res.render('contents/customer', {
      title: '客户管理',
      user,
      customers
    })
  },
  // GET /id
  getCustomer: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    let customer = await Models.Customer.findById(req.params.id)
    let creator = await Models.User.findById(customer.creatorId)
    let products = [], cooperators = []

    // 获取产品名
    for(let id of customer.products){
      let data = await Models.Product.findById(id)
      products.push(data.name)
    }
    customer.productsName = products

    // 获取协助者名称
    // for(let id of customer.cooperators){
    //   let data = await Models.User.findById(id)

    //   cooperators.push(data.name)
    // }
    
    return res.render('contents/customerInfo', {
      title: '客户',
      user: JSON.parse(req.session.user),
      customer,
      creator
    })
  },

  // POST /newCustomer
  createCustomer: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    req.body.createAt = new Date()
    req.body.creator = JSON.parse(req.session.user).name
    req.body.creatorId = JSON.parse(req.session.user)._id
    req.body.status = 0
    Models.Customer(req.body).save(err=>{
      return res.redirect('/customer')
    })
  },
  // POST /getCustomerInfo
  getCustomerInfo: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')

    let customer = await Models.Customer.findById(req.body.id)
    let users = await Models.User.find({})
    let products = await Models.Product.find({})

    return res.json({
      customer,
      users,
      products
    })
  },
  // POST /changeCustomerInfo
  changeCustomerInfo: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    let id = req.body.id
    delete req.body.id
    req.body.updateAt = new Date()

    req.body.products = req.body.products?req.body.products:[]
    req.body.cooperators = req.body.cooperators?req.body.cooperators:[]

    Models.Customer.findByIdAndUpdate(id, req.body, (err, customer)=>{
      customer.logs.push({
        words: '更新了客户信息',
        time: new Date(),
        user: JSON.parse(req.session.user).name,
        userId: JSON.parse(req.session.user)._id
      })
  
      Models.Customer.findByIdAndUpdate(id, {logs: customer.logs}, (err, customer)=>{
        return res.redirect('/customer/' + id)
      })
    })
  },
  // POST /changeCompanyInfo
  changeCompanyInfo: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    let id = req.body.id
    delete req.body.id
    req.body.updateAt = new Date()

    Models.Customer.findByIdAndUpdate(id, req.body,(err, customer)=>{
      customer.logs.push({
        words: '更新了公司信息',
        time: new Date(),
        user: JSON.parse(req.session.user).name
      })
  
      Models.Customer.findByIdAndUpdate(id, {logs: customer.logs}, (err, customer)=>{
        return res.redirect('/customer/' + id)
      })
    })
  },
  // POST /addWord 
  addWord: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    let id = req.body._id

    let customer = await Models.Customer.findById(id)

    var word = {
      words: req.body.words,
      time: new Date(),
      user: JSON.parse(req.session.user).name,
      userId: JSON.parse(req.session.user)._id
    }

    if(req.file){
      var filename = id + '-' + Date.now()+ '.' + req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]

      fs.renameSync(path.join(FILE_PATH, req.file.filename), path.join(FILE_PATH, filename))

      word.file = {
        name: req.file.originalname,
        path: '/file/' + filename
      }
    }

    customer.words.push(word)

    await Models.Customer.findByIdAndUpdate(id, customer)

    return res.redirect('/customer/' + id)
  },
  // POST /deleteWord 
  deleteWord: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')

    let customer = await Models.Customer.findById(req.body.cid)

    for(let i=0; i<customer.words.length; i++){
      if(customer.words[i]._id == req.body.wid){
        if(customer.words[i].file && customer.words[i].file.path && customer.words[i].file.name){
          if(fs.existsSync(path.join(__dirname, '../public', customer.words[i].file.path)))
            fs.unlinkSync(path.join(__dirname, '../public', customer.words[i].file.path))
        }

        customer.words.splice(i, 1)

        await Models.Customer.findByIdAndUpdate(req.body.cid, customer)

        return res.json({
          result: true,
          message: '删除成功！'
        })
      }
    }
  },
};

module.exports = Home;
