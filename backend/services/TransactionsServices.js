const { NotFoundError, ValidationError, BadRequestError } = require('../utils/errors')

exports.getTransactions = async () => {
    const options = {
        url: 'https://graphql.bitquery.io/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'BQYsSEDkI48tcnGecUYnGdrEZdd5apK2', // Replace with your Bitquery API key
        },
        body: JSON.stringify({
          query: `query {
            {
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
              }
          }`,
        }),
      };
    
      request(options, (error, response, body) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.send(body);
      });
}
