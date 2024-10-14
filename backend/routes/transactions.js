const express = require('express')
const router = express.Router()
const {ROLE} = require('../config/constant')

const AuthMiddleware = require('../middlewares/Authentication')
const TransactionsController = require('../controllers/TransactionsController')

router.get('/top10', TransactionsController.getTransactions)



module.exports = router;