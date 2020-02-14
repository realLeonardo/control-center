const router = require('express').Router();
const site = require('../controller/Site');

/* GET home page. */
router.get('/', site.index);
router.post('/createSite', site.createSite);
router.post('/getSiteInfoById', site.getSiteInfoById);
router.post('/changeSiteInfoById', site.changeSiteInfoById);

router.post('/restart', site.restart);
router.post('/stop', site.stop);

module.exports = router;
