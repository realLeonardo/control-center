var router = require('express').Router();
var customer = require('../controller/Customer');
var path = require('path');
var multer = require('multer');

var upload = multer({ dest:  path.join(__dirname,'../public/file')});  

/* GET home page */
router.get('/', customer.index);
router.get('/:id', customer.getCustomer);

router.post('/newCustomer', customer.createCustomer);
router.post('/getCustomerInfo', customer.getCustomerInfo);
router.post('/changeCustomerInfo', customer.changeCustomerInfo);
router.post('/changeCompanyInfo', customer.changeCompanyInfo);
router.post('/addWord', upload.single('file'), customer.addWord);
router.post('/deleteWord', customer.deleteWord);

module.exports = router;
