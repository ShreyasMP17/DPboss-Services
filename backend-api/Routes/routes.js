const express = require('express')
const { getLottery,getLiveLottery,createLottery, getLotteryById, updateLottery, deleteLottery, postWeek, updateWeek } = require('../Controller/user.controller')
const{createAdmin,loginAdmin, getAllAdmins, } = require('../Controller/adminLogin.controler')
const router = express.Router()

router.post('/post-data', createLottery)
router.get('/get-data', getLottery)
router.post('/login', createAdmin)
router.post('/loginadmin', loginAdmin)
router.get('/admins',getAllAdmins)
router.get('/live-results', getLiveLottery);

// router.post('/admin-lottery', createLottery);
// router.get('/get-data', getAllLottery);
router.get('/get-data/:id', getLotteryById);
router.put('/get-data/:id', updateLottery);
router.delete('/get-data/:id', deleteLottery);
router.post('/get-data/:id', postWeek);
router.put('/get-data/:id/:recordId', updateWeek)





module.exports = router