"use strict";
const { default: axios } = require('axios');
const _ = require('lodash');
const util = require('../util');
const path = require('path');

const processOrder = async (req, res) => {
    try {
        const body = _.pick(req.body, ['name', 'email', 'amount', 'currency', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvv']);

        const form = { ...body, merchantId: 'TEST630738f8c10ba', orderId: util.orderId() };

        const { data: tnx } = await axios.get('https://api.netpluspay.com/v2/checkout', {
            params: {
                ...form
            }
        });
        
        const payload_object = {
            transId: tnx.transId,
            domain: tnx.domain,
            cardNumber: body.cardNumber,
            expiryDate: body.expiryMonth + body.expiryYear,
            cvv: body.cvv
        };

        const payload = Object.values(payload_object).join(':');

        const { data: processor } = await axios.post('https://api.netpluspay.com/v2/pay', {
            clientData: btoa(payload),
            type: "PAY"
        });

        //5123450000000008 2223000000000007 5111111111111118 2223000000000023
        if(processor?.code === '90'){
            return res.send({ message: "Failed Response", ...processor });
        }

        /* if(processor?.code === 'S0'){
            return res.redirect(`https://api.netpluspay.com/transactions/requery/${tnx.merchantId}/${tnx.transId}`);
        } */

        return res.send({
            title: 'API Examples',
            body: processor,
            transaction: tnx
        });
    } catch (error) {
        return res.send({
            message: error.message
        })
    }
};

const processPayment = async (req,res) => {
    const transId = req?.params?.ref;
    res.render(__dirname + "/../views/index.html", {name: 'John'});
    //__dirname : It will resolve to your project folder.
}

module.exports = {
  processOrder,
  processPayment
};
