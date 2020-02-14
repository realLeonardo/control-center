const Models = require('../model/dataModel');
const nodemailer = require('nodemailer')

let mailTransport = nodemailer.createTransport({
  host : 'smtp.exmail.qq.com',
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth : {
      user : 'freetes@foxmail.com.com',
      pass : 'wjwjwj5201'
  },
});

// 处理主页的请求
const User = {
  // GET /
  index: (req, res)=>{
    delete req.session.user

    return res.render('signin', {
      title: '交付中心',
    })
  },
  // POST /
  signin: (req, res)=>{
    Models.User.findOne({email: req.body.email}, (err, user)=>{
      // 账号不存在
      if(!user){
        return res.json({
          result: false,
          message: '账号不存在'
        })
      }
      else{
        // 密码错误
        if(user.password != req.body.password){
          return res.json({
            result: false,
            message: '密码错误！'
          })
        }
        // 登录成功
        else{
          req.session.user = JSON.stringify(user)
          return res.json({
            result: true,
            message: '登录成功！'
          })
        }
      }
    })
  },
  // POST /createUser
  createUser: (req, res)=>{
    if(!req.session.user){
      return res.json({
        result: false,
        message: '请先登录！'
      })
    }
    Models.User.findOne({email: req.body.email}, (err, user)=>{
      // 账号已存在
      if(user){
        return res.json({
          result: false,
          message: '账号已存在'
        })
      }
      else{
        req.body.password = "ruler2019"
        req.body.level = 1
        
        Models.User(req.body).save(err=>{
          if(err) {
            return res.json({
              result: false,
              message: '新建失败',
              err
            })
          }

          const options = {
            from: '"RulerTech" <rd@rulertech.com>',
            to: `"${req.body.name}" <${req.body.email}>`,
            subject: `【平台账号开通】`,
            html: `
              <br>
              <h2>Hi，亲爱的${req.body.name}</h2>
              <p>科技交付中心的账号已开通，网址为 ${req.headers.origin}</p>
              <p>你的账号：${req.body.email}</p>
              <p>你的密码：ruler2019</p>
              <br>
              `
          };
  
          mailTransport.sendMail(options, function(err, msg){
            if(err){
              return res.json({result: false, message: err})
            }
            else {
              return res.json({result: true, message: '创建成功～'})
            }
          });
        })
      }
    })
  },
  // POST /getUserInfoById
  getUserInfoById: (req, res)=>{
    Models.User.findById(req.body.id, (err, user)=>{
      return res.json(user)
    })
  },
  // POST /getUserInfoById
  changeUserInfoById: (req, res)=>{
    var id = req.body.id
    delete req.body.id

    Models.User.findByIdAndUpdate(id, req.body, (err, user)=>{
      if(err){
        return res.json({
          result: false,
          message: err
        })
      }
      return res.json({
        result: true,
        message: '编辑成功'
      })
    })
  },
  // POST /deleteUserById
  deleteUserById: (req, res)=>{
    Models.User.findByIdAndRemove(req.body.id, (err)=>{
      if(err){
        return res.json({
          result: false,
          message: err
        })
      }
      return res.json({
        result: true,
        message: '删除成功'
      })
    })
  },
  // POST /addAuth
  addAuth: (req, res)=>{
    if(!req.session.user) return res.json(false)
    Models.User.findOne({email: req.body.email}, (err, user)=>{
      user.sites.push({
        url: req.body.url,
        email: req.body.data.email,
        password: req.body.data.password
      })
      Models.User.findByIdAndUpdate(user._id, user, (err)=>{
        delete req.session.user

        req.session.user = JSON.stringify(user)
        if(err) return res.json(false)
        return res.json(true)
      })
    })
  }
};

module.exports = User;


