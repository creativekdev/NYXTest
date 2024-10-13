const { NotFoundError, ValidationError, BadRequestError } = require('../utils/errors')
const TransactionsServices = require('../services/transactionsservices')

const User = require('../models/User')
const Payment = require('../models/Payment')

// --------------- Sponsor ---------------- //
exports.getTransactions = async (req, res) => {
    const transantions = await TransactionsServices.getTransactions()
    res.status(200).json(transantions)
}
