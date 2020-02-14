/**
 * Api
 * @author mufeng
 * @since 2018-10-10
 */

const fs = require('fs')
const path = require('path')
const request = require('request')
const axios = require('axios')
const Models = require('../model/dataModel')

function getAccessToken () {
	return new Promise((resolve, reject) => {
		const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa8da1268a52a4b11&secret=69ba41c99204fc96432f34993ad7227f'
		request({
      url,
      json: true
    }, (err, res, body) => {
			if (err) {
				reject(err)
			} else {
				resolve(body)
			}
		})
	})
}

function downloadWXCode (scene, accessToken, fileUrl) {
	return new Promise((resolve, reject) => {
		const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`
		const filePath = `/home/ruler/control-center/public${fileUrl}`
		const writeStream = fs.createWriteStream(filePath, { flags: 'w' })

		writeStream.on('unpipe', () => {
			reject(new Error('unpipe'))
		}).on('close', () => {
			resolve()
		})

		request({
      url,
      method: 'POST',
      json: {
        scene,
        page: 'pages/sendResume/main',
        width: 600
      }
    }).on('error', (err) => {
			reject(err)
		}).pipe(writeStream)
	})
}

// 处理主页的请求
const Api = {
  // GET /
  wxcode: async (req, res, next) => {
    if(!req.session.user) return res.redirect('/signin')

    try {
    	const { id, port } = req.query
	    const result = await getAccessToken()
	    const accessToken = result.access_token
	    const scene = `port=${port}`
	    const wxcode = `/wxcode/${id}.jpg`

	    await downloadWXCode(scene, accessToken, wxcode)
	    await Models.Site.findByIdAndUpdate({ '_id': id }, { wxcode })

	    res.json({
	    	wxcode
	    })
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getAllJobs
  getAllJobs: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			var user = await Models.WxUser.findOne({openid: req.body.openid})

      if(!user){
        return res.json({
          result: false,
          message: '无权限'
        })
			}
			
			try {
				let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/getOfferJobsByOpenid`, {name: user.userInfo.name, openid: req.body.openid, email: user.userInfo.email})

				return res.json(result.data)
			} catch (error) {
				return res.json({
					result: false,
					message: '获取职位失败'
				})
			}

    }	catch (err) {
    	next(err)
    }
	},
	// POST /getAllResumes
  getAllResumes: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let sites = await Models.Site.find({})
			var data = []
			for(let item of sites){
				try {
					let result = await axios.get(item.url + '/api/getAllSuggestions')
					data.push(result.data)
				} catch (error) {
					continue
				}
			}

			return res.json(data)
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getWxUser
  getWxUser: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let user = await Models.WxUser.findOne({openid: req.body.openid})

			return res.json(user)
    }	catch (err) {
    	next(err)
    }
	},
	// POST /createWxUser
  createWxUser: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let sites = await Models.Site.find({})

			let foundPort = false
			for(let item of sites){
				if(item.url.indexOf(req.body.userInfo.port) != -1){
					foundPort = true
				}
			}

			if(!foundPort){
				return res.json({
					result: false,
					message: '企业ID错误'
				})
			}

			req.body.userInfo.status = 0

			let users = await Models.WxUser.find({openid: req.body.openid})

			if(users.length != 0){
				await Models.WxUser.findOneAndUpdate({openid: req.body.openid}, {userInfo: req.body.userInfo})

				req.body.userInfo.openid = req.body.openid

				let result = await axios.post(`http://rulertech.com:${req.body.userInfo.port}/api/createWxUser`, req.body.userInfo)
				
				return res.json({
					result: true,
					message: '保存成功！'
				})
			}

			let data = await Models.WxUser(req.body).save()

			req.body.userInfo.openid = req.body.openid

			req.body.userInfo.avatar = req.body.wxinfo.avatarUrl
			req.body.userInfo.nickname = req.body.wxinfo.nickname
			
			let result = await axios.post(`http://rulertech.com:${req.body.userInfo.port}/api/createWxUser`, req.body.userInfo)
			
			return res.json({
				result: true,
				message: '保存成功！'
			})

    }	catch (err) {
    	next(err)
    }
	},
	// POST /changeWxUser
  changeWxUser: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			Models.WxUser.findOneAndUpdate({openid: req.body.openid}, {'userInfo.status': req.body.status}, (err)=>{
				if(err){
					return res.json({
						result: false,
						message: '修改失败'
					})
				}
				return res.json({
					result: true,
					message: '更新成功！'
				})
			})
    }	catch (err) {
    	next(err)
    }
	},
	// GET /getSaasPorts
  getSaasPorts: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			var sites = await Models.Site.find({}), data = []

			for(let item of sites){
				try {
					let result = await axios.get(item.url + '/api/getSiteInfo')
					result.data.port = item.url.split('.com:')[1]
					data.push(result.data)
				} catch (error) {
					continue
				}
			}

			return res.json({
				result: true,
				data: data
			})

    }	catch (err) {
    	next(err)
    }
	},
	// POST /getSaasInfoByPort
	getSaasInfo: async (req, res)=>{
		res.header('Access-Control-Allow-Origin', '*');

    try {

			if(!req.body.sid || req.body.sid == ''){
				return res.json({
					result: false,
					message: '请求参数 sid 缺失'
				})
			}

			try {
				let result = await axios.get('http://rulertech.com:' + req.body.sid + '/api/getSiteInfo')
				result.data.port = req.body.sid
				return res.json({
					result: true,
					data: result.data,
					message: '获取 SaaS 信息成功！'
				})
			} catch (error) {
				return res.json({
					result: false,
					data: error,
					message: '获取失败'
				})
			}
    }	catch (err) {
    	next(err)
    }
	},
	// POST /createJob
  createJob: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			var user = await Models.WxUser.findOne({openid: req.body.openid})

			if(user.userInfo.status == 1){
				let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/createOfferJob`, {jobInfo: req.body.jobInfo, userInfo: user.userInfo})
			}
			else{
				return res.json({
					result: false,
					message: '用户权限不足'
				})
			}
			
			return res.json({
				result: true,
				message: '保存成功！'
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getDepartments
  getDepartments: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			var user = await Models.WxUser.findOne({openid: req.body.openid})

			let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/getAllDepartments`)
			
			return res.json({
				result: true,
				data: result.data
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getSuggestByJobId
  getSuggestByJobId: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let user = await Models.WxUser.findOne({openid: req.body.openid})

			let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/getSuggestByID`, {id: req.body.id})

			return res.json({
				result: true,
				data: result.data
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getCompanyInfo
  getCompanyInfo: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let user = await Models.WxUser.findOne({openid: req.body.openid})

			let result = await axios.get(`http://rulertech.com:${user.userInfo.port}/api/getSiteInfo`)

			return res.json({
				result: true,
				data: result.data
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getSuggestionInfo
  getSuggestionInfo: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let user = await Models.WxUser.findOne({openid: req.body.openid})

			let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/getSuggestionInfoById`, {id: req.body.id})

			return res.json({
				result: true,
				data: result.data
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /changeSuggestStatus
  changeSuggestStatus: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let user = await Models.WxUser.findOne({openid: req.body.openid})

			let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/changeSuggestStatus`, {id: req.body.id, status: req.body.status, words: req.body.words})

			return res.json({
				result: true,
				data: result.data
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /sendOffer
  sendOffer: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let user = await Models.WxUser.findOne({openid: req.body.openid})

			let result = await axios.post(`http://rulertech.com:${user.userInfo.port}/api/sendOffer`, {id: req.body.id, offer: req.body.offer})

			return res.json({
				result: true,
				data: result.data
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /savePerson
	savePerson: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let persons = await Models.UserPerson.find({openid: req.body.openid, personid: req.body.id})

			if(persons.length == 0){
				Models.UserPerson.create({openid: req.body.openid, personid: req.body.id, createAt: Date.now()},  function (err, small) {
					if (err) return res.json({
						result: false,
						message: '新建信息失败'
					});
					// saved!
					return res.json({
						result: true,
						message: '储备成功！'
					});
				})
			}
			else{
				return res.json({
					result: false,
					message: '已存在'
				});
			}
    }	catch (err) {
    	next(err)
    }
	},
	// POST /getPerson
	getPerson: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let logs = await Models.UserPerson.find({openid: req.body.openid, personid: req.body.id})

			if(logs.length == 0){
				return res.json({
					result: false,
					message: '不存在'
				})
			}
			else{
				return res.json({
					result: true,
					message: '存在'
				})
			}
    }	catch (err) {
    	next(err)
    }
	},
	// POST /deletePerson
	deletePerson: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let logs = await Models.UserPerson.deleteOne({openid: req.body.openid, personid: req.body.id})

			return res.json({
				result: true,
				message: '删除成功'
			})
    }	catch (err) {
    	next(err)
    }
	},
	// POST /findAllPerson
	findAllPerson: async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');

    try {
			let logs = await Models.UserPerson.find({openid: req.body.openid})

			return res.json({
				result: true,
				data: logs
			})
    }	catch (err) {
    	next(err)
    }
	},
};

module.exports = Api;