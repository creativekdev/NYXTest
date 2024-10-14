const axios = require('axios'); // Use axios instead of request for better handling.
const { NotFoundError, ValidationError, BadRequestError } = require('../utils/errors');
const TransactionsServices = require('../services/transactionsservices');

const User = require('../models/User');
const Payment = require('../models/Payment');

exports.getTransactions = async (req, res) => {
  try {
    // Setup the request options
    const options = {
      url: 'https://graphql.bitquery.io/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'BQYsSEDkI48tcnGecUYnGdrEZdd5apK2', // Replace with your Bitquery API key
      },
      data: {
        query: `{
          ethereum(network: bsc) {
            transfers(
              options: {desc: "amount", limit: 10, offset: 0}
              date: {since: "2024-10-01"}
              currency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
              amount: {gt: 0}
            ) {
              amount
              currency {
                symbol
              }
              receiver {
                address
              }
              transaction {
                hash
              }
            }
          }
        }`
      }
    };

    // Make the API request using axios
    const response = await axios(options);

    // If no data returned, throw a NotFoundError
    if (!response.data || !response.data.data || !response.data.data.ethereum.transfers) {
      throw new NotFoundError('No transactions found');
    }

    // Return the transactions data
    res.status(200).json({
      success: true,
      data: response.data.data.ethereum.transfers
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);

    // Handle API errors
    if (error.response) {
      // Bitquery API returned an error response
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.errors || 'Bitquery API Error',
      });
    }

    // Internal server error
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
