/**
 * Company
 * @author mufeng
 * @since 2018-09-10
 */

const Models = require('../model/dataModel');

// 处理主页的请求
const Company = {
  // GET /
  index: (req, res)=>{
    if(!req.session.user) return res.redirect('/signin')
    
    Models.Site.find({}, (err, sites)=>{
      if(err) return res.json(err)
      return res.render('contents/company', {
        title: '公司信息',
        user: JSON.parse(req.session.user),
        sites: JSON.stringify(sites)
      })
    })
  }
};

module.exports = Company;
