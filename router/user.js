const router = require('express').Router();
const user = require('../controller/User');

/* GET home page. */
router.get('/', user.index);
router.post('/', user.signin);
router.post('/createUser', user.createUser);
router.post('/getUserInfoById', user.getUserInfoById);
router.post('/changeUserInfoById', user.changeUserInfoById);
router.post('/deleteUserById', user.deleteUserById);
router.post('/addAuth', user.addAuth);

module.exports = router;
