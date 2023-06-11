const router = require('express').Router()
const TpController = require('../Controller/TpController')


router.post('/register',TpController.register)
router.post('/login',TpController.login)
router.post('/checkMobile',TpController.checkMobile)
router.put('/reset',TpController.reset)

router.put('/updateProfile',TpController.updateProfile)
router.get('/fetchCourses',TpController.fetchCourses)
router.post('/fetchEnroll',TpController.fetchEnroll)
router.post('/insertEnroll',TpController.insertEnroll)
router.post('/removeEnroll',TpController.removeEnroll)
router.post('/fetchChapters',TpController.fetchChapters)

router.post('/getTest',TpController.getTest)
router.post('/getQuestions',TpController.getQuestions)
router.post('/storeResult',TpController.storeResult)
router.post('/fetchChapterWiseResult',TpController.fetchChapterWiseResult)

router.post('/home',TpController.home)


router.post('/fetchEnrollCourses',TpController.fetchEnrollCourses)
router.post('/storeChat',TpController.storeChat)
router.post('/fetchChat',TpController.fetchChat)


module.exports = router