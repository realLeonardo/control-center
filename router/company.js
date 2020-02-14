/**
 * Company
 * @author mufeng
 * @since 2018-09-10
 */

const router = require('express').Router();
const company = require('../controller/Company');

/* GET home page. */
router.get('/', company.index);

module.exports = router;