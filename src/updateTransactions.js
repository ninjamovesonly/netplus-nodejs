const axios = require('axios');
const cron = require('node-cron');
const { Transaction } = require('./models');

// Define a function to update the transactions table

const updateTransactions = async () => {
    try {
      // Find all transactions with status = 'pending'
      const transactions = await Transaction.findAll({
        where: { transStatus: 'PENDING' },
      });
  
      // Use map and Promise.all to update all transactions asynchronously
      await Promise.all(transactions.map(async (transaction) => {
        // Make an API request to get the current status
        const url = `https://api.netpluspay.com/transactions/requery/${transaction.merchantId}/${transaction.transId}`;
        const { data: response} = await axios.get(url);
  
        // Update the status of the transaction with the new value
        await transaction.update({ 
            transStatus: response.status,
            statusCode: response.code 
        });
      }));
    } catch (error) {
      console.error(error);
    }
};

// Run the updateTransactions function every minute
cron.schedule('* * * * *', updateTransactions);

// Export the updateTransactions function as a module
module.exports = { updateTransactions };