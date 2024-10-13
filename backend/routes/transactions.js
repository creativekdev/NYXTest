const express = require('express')
const router = express.Router()
const {ROLE} = require('../config/constant')

const AuthMiddleware = require('../middlewares/Authentication')
const PaymentController = require('../controllers/PaymentController')

router.get('/top10', PaymentController.getPayments)



module.exports = router;