import React, { useState, useEffect } from 'react';
import Navbar from "../common/Navbar";

function Transactions() {
  const [interval, setIntervalTime] = useState(60); // Default interval of 60 seconds
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch transactions from the Bitquery API
  const fetchTransactions = async () => {
    setLoading(true); // Manage the loading state in your UI
    try {
      // Make a request to your backend API instead of Bitquery directly
      const response = await fetch('http://localhost:5000/api/transactions/top10', {
        method: 'GET', // Adjust method to 'GET' or whatever is appropriate for your backend API
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json(); // Parse the response as JSON
      console.log(data); // Log the full response for debugging
  
      if (data?.data) {
        // If transactions data is available, update the state
        setTransactions(data.data); // Assume setTransactions manages the transaction state
      } else {
        // No data found, set to empty array
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]); // Set to empty in case of error
    } finally {
      setLoading(false); // Turn off the loading spinner or indicator
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
                    <th className="p-2 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} className="bg-gray-700">
                        <td className="p-2 border-b">{transaction.transaction.hash}</td>
                        <td className="p-2 border-b">{transaction.receiver.address}</td>
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
