import React, { useState, useEffect } from 'react';
import Navbar from "../common/Navbar";

function Transactions() {
  const [interval, setIntervalTime] = useState(60); // Default interval of 60 seconds
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch transactions from the Bitquery API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://graphql.bitquery.io/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'BQYsSEDkI48tcnGecUYnGdrEZdd5apK2' // Replace with your Bitquery API key
        },
        body: JSON.stringify({
          query: `
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
                        
          `
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      if (data?.data?.ethereum?.transfers) {
        setTransactions(data.data.ethereum.transfers);
      } else {
        setTransactions([]); // Set to empty if no transfers found
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]); // Optionally set to empty if an error occurs
    } finally {
      setLoading(false);
    }
  };

  // Effect to run the fetch function at the given interval
  useEffect(() => {
    fetchTransactions(); // Initial fetch when component mounts

    const intervalId = setInterval(() => {
      fetchTransactions();
    }, interval * 1000); // Convert interval to milliseconds

    // Clean up interval on component unmount or when interval changes
    return () => clearInterval(intervalId);
  }, [interval]);

  return (
    <React.Fragment>
      <div>
        <Navbar />
        <div className="flex flex-col w-full items-center gap-5 p-4">
          
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] text-transparent bg-clip-text mt-2 text-center">
            Monitor Whale Transactions on Binance Smart Chain
          </h1>

          {/* Input box to set the interval timer */}
          <div className="flex flex-col items-center">
            <label htmlFor="interval" className="text-white text-lg">Set Interval Timer (in seconds): </label>
            <input
              type="number"
              id="interval"
              value={interval}
              onChange={(e) => setIntervalTime(e.target.value)}
              className="w-24 p-2 border-2 border-gray-300 rounded mb-4 text-black"
            />
          </div>

          {/* Transactions table */}
          <h3 className="text-xl text-white font-bold text-center">Top 10 Whale Transactions</h3>
          {loading ? (
            <p className="text-white">Loading transactions...</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-white text-center border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 border-b">Transaction Hash</th>
                    <th className="p-2 border-b">Receiver Address</th>
                    <th className="p-2 border-b">Currency</th>
                    <th className="p-2 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} className="bg-gray-700">
                        <td className="p-2 border-b">{transaction.transaction.hash}</td>
                        <td className="p-2 border-b">{transaction.receiver.address}</td>
                        <td className="p-2 border-b">{transaction.currency.symbol}</td>
                        <td className="p-2 border-b">{transaction.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-2">No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Transactions;
