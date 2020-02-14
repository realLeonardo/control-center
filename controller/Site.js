const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const fs = require("fs");
const { exec } = require('child_process');

// 处理主页的请求
const Home = {
  // GET /
  index: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    let sites = await Models.Site.find({}).sort({_id: -1})
    // let customers = await Models.Customer.find({})
    
    return res.render('contents/site', {
      title: 'ATS管理',
      user: JSON.parse(req.session.user),
      sites,
      // customers
    })
  },
  // POST /createSite
  createSite: async (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    const user = {
      email: req.body.email,
      password: req.body.password,
    }

    const sites = await Models.Site.find({})

    let port = 3001 + sites.length
    let options = {
      dbName: 'site_' + port,
      port,
    }

    const createDBText = `
      use ${options.dbName}

      db.dropDatabase()

      use ${options.dbName}

      db.organizations.insert({"name": "${req.body.name}", "subName": ""})

      db.users.insert({
        "email" : "${user.email}",
        "name" : "${user.email}",
        "password" : "${user.password}",
        "level" : 2
      })
    `

    const serverText = `#!/usr/bin/env node

/**
* Module dependencies.
*/

var app = require('../app');
var debug = require('debug')('we:server');
var http = require('http');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/${options.dbName}', err=>{
if(err)
  console.log("Failed to connect MongoDB Server!");
else
  console.log("Succeed in connecting MongoDB Server!");
});

/**
* Get port from environment and store in Express.
*/

var port = normalizePort(process.env.PORT || '${options.port}');
app.set('port', port);

/**
* Create HTTP server.
*/

var server = http.createServer(app);

/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
var port = parseInt(val, 10);

if (isNaN(port)) {
  // named pipe
  return val;
}

if (port >= 0) {
  // port number
  return port;
}

return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
if (error.syscall !== 'listen') {
  throw error;
}

var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

// handle specific listen errors with friendly messages
switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
}
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
var addr = server.address();
var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
debug('Listening on ' + bind);
}
`
    
    fs.writeFile('./util/script/createDB.js', createDBText, (err) => {
      if (err) throw err;

      exec('mongo < ./util/script/createDB.js', (error, stdout, stderr)=>{
        if(error) console.log(error)
        
        const filePath = `/Users/freetes/Project/Work/HRSaaS/bin/${options.dbName}.js`
        fs.writeFile(filePath, serverText, (err)=>{
          exec(`cd /Users/freetes/Project/Work/HRSaaS/bin/ && pm2 start ${options.dbName}.js`, (error, stdout, stderr)=>{
            if(error) console.log(error)

            Models.Site({
              name: req.body.name,
              dbName: options.dbName,
              admin: user,
              kind: req.body.kind,
              url: 'http://127.0.0.1:' + options.port
            }).save(err=>{
              return res.redirect('/site')
            })
          })
        })
      })
    });
  },
  // POST /getSiteInfoById
  getSiteInfoById: async (req, res)=>{
    
    let site = await Models.Site.findById(req.body.id)

    return res.json({
      result: true,
      data: site,
      message: '获取站点信息成功！'
    })
  },
  // POST /changeSiteInfoById
  changeSiteInfoById: async (req, res)=>{
    
    await Models.Site.findByIdAndUpdate(req.body.id, req.body)

    return res.redirect('/site')
  },
  // POST /newCustomer
  createCustomer: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    req.body.createAt = new Date()
    req.body.creater = JSON.parse(req.session.user).name
    req.body.status = 0
    Models.Customer(req.body).save(err=>{
      return res.redirect('/site')
    })
  },
  // POST /getCustomerInfo
  getCustomerInfo: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')

    Models.Customer.findById(req.body.id, (err, customer)=>{
      return res.json(customer)
    })
  },
  // POST /changeCustomerInfo
  changeCustomerInfo: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    let id = req.body.id
    delete req.body.id
    req.body.updateAt = new Date()

    Models.Customer.findByIdAndUpdate(id, req.body, (err, customer)=>{
      customer.logs.push({
        words: '更新了客户信息',
        time: new Date(),
        user: JSON.parse(req.session.user).name
      })
  
      Models.Customer.findByIdAndUpdate(id, {logs: customer.logs}, (err, customer)=>{
        return res.redirect('/site/customer/' + id)
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
        return res.redirect('/site/customer/' + id)
      })
    })
  },
  // POST /addLog
  addLog: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    let id = req.body.id
    delete req.body.id

    Models.Customer.findById(id, (err, customer)=>{
      customer.words.push({
        words: req.body.words,
        time: new Date(),
        user: JSON.parse(req.session.user).name
      })

      Models.Customer.findByIdAndUpdate(id, {words: customer.words}, (err, customer)=>{
        return res.json(customer)
      })
    })
  },

  // GET /customer/id
  getCustomer: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    console.log(req.params.id)
    Models.Customer.findById(req.params.id, (err, customer)=>{
      return res.render('contents/customer', {
        title: '客户',
        user: JSON.parse(req.session.user),
        customer
      })
    })
  },

  restart: (req, res) => {
    const fileName = req.body.fileName
    const filePath = `${fileName}.js`

    exec(`cd /home/ruler/rulerTechSystem/bin/ && pm2 restart ${filePath}`, (err, stdout, stderr)=>{
      if(err) {
        res.redirect('/site?msg=' + err.message)
      } else {
        res.redirect('/site')
      }
    })
  },

  stop: (req, res) => {
    const fileName = req.body.fileName
    const filePath = `${fileName}.js`

    exec(`pm2 stop ${filePath}`, (error, stdout, stderr)=>{
      if(error) {
        res.redirect('/site?msg=' + err.message)
      } else {
        res.redirect('/site')
      }
    })
  }
};

module.exports = Home;
