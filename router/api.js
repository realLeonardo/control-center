/**
 * Api
 * @author mufeng
 * @since 2018-10-10
 */

const router = require('express').Router();
const api = require('../controller/Api');

router.get('/wxcode', api.wxcode);
router.post('/getAllJobs', api.getAllJobs);
router.post('/getAllResumes', api.getAllResumes);

router.post('/getWxUser', api.getWxUser);
router.post('/createWxUser', api.createWxUser);
router.post('/changeWxUser', api.changeWxUser);

router.get('/getSaasPorts', api.getSaasPorts);
router.post('/getSaasInfoByPort', api.getSaasInfo);
router.post('/createJob', api.createJob);
router.post('/getSuggestByJobId', api.getSuggestByJobId);
router.post('/getCompanyInfo', api.getCompanyInfo);
router.post('/getSuggestionInfo', api.getSuggestionInfo);
router.post('/changeSuggestStatus', api.changeSuggestStatus);
router.post('/sendOffer', api.sendOffer);
router.post('/getDepartments', api.getDepartments);

router.post('/savePerson', api.savePerson);
router.post('/getPerson', api.getPerson);
router.post('/deletePerson', api.deletePerson);
router.post('/findAllPerson', api.findAllPerson);

module.exports = router;