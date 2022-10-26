const axios = require('axios');
const logger = require('../util/log');

const paystack = () => {
    const MySecretKey = 'Bearer sk_test_db1be697b0333b8b9d388eb4b47821e293c3fb7c';
    // sk_test_xxxx to be replaced by your own secret key
    const initializePayment = async (data) => {
        const url = 'https://api.paystack.co/transaction/initialize';
        const options = {
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        }
        try {
            const { data: response } = await axios.post(url, data, options);
            return response?.data;
        } catch (error) {
            logger(error);
            return null;
        }
    }

   const verifyPayment = async (ref) => {
        const url = 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref);
        const options = {
            headers : {
                    authorization: MySecretKey,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache'
            }
        }
        try {
            const { data: request } = await axios.get(url, options);
            return request;
        } catch (error) {
            logger(error);
            return null;
        }
    }

   return {initializePayment, verifyPayment};
}

module.exports = paystack;