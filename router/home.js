const router = require('express').Router();
const home = require('../controller/Home');

/* GET home page */
router.get('/', home.index);
router.get('/account', home.getAccount);
// router.get('/customer', home.gotoCustomerPage);

router.get('/product', home.getProduct);
router.post('/newProduct', home.createProduct);
router.post('/changeProduct', home.changeProduct);
router.post('/getProduct', home.getProductByAjax);

module.exports = router;
