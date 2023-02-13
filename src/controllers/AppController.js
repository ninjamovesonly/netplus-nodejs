"use strict";
const { default: axios } = require('axios');
const _ = require('lodash');
const util = require('../util');
const views = require('../views');
const { Transaction, User, MerchantId } = require("../models");
const logger = require('../util/log');

const processOrder = async (req, res) => {
    try {
        const body = _.pick(req.body, 
            [
                'name', 'email', 'amount', 'currency', 'merchantId', 'passKey', 'callbackUrl', 'metadata' 
            ]
        );
        body.currency = (!body?.currency) ? "USD" : body.currency;

        const user = await User.findOne({
            where: { key: body?.passKey }
        });

        if(!user){
            return res.send({
                success: false,
                message: "Invalid Authorization"
            });
        }

        if(parseFloat(body?.amount) > 200){
            return res.send({
                success: false,
                message: `Amount must not be greater than 200${body.currency}`
            });
        }

        if(parseFloat(body?.amount) < 1){
            return res.send({
                success: false,
                message: `Amount cannot be less than 1${body.currency}`
            });
        }

        /* const merchant = await MerchantId.findOne({
            where: { merchant: body?.merchantId }
        });

        if(!merchant){
            return res.send({
                success: false,
                message: "Invalid Authorization"
            });
        } */

        const form = { ...body, orderId: util.orderId() };

        const { data } = await axios.get('https://api.netpluspay.com/v2/checkout', {
            params: {
                ...form
            }
        });

        if(!data){
            return res.send({
                success: false,
                message: "Unable to initialize transaction"
            });
        }

        //Check to ensure generated code not in database
        //Preventing repeating accessCode within the database
        let hasAccessCode = true;
        let accessCode = null;

        do {
            accessCode = util.orderId(10);
            hasAccessCode = await Transaction.findOne({
                where: { accessCode: accessCode }
            });
        } while (hasAccessCode);

        //Generate access code link
        const origin = `${req?.protocol}://${req?.get('host')}`;
        const url = origin + '/checkout/' + accessCode;

        //Save transaction to database
        const saveTransaction = await Transaction.create({ 
            id: util.guid(),
            authorizationUrl: url,
            currency: form.currency,
            name: body.name,
            email: body.email,
            userKey: body.passKey,
            accessCode: accessCode,
            callbackUrl: body?.callbackUrl || origin + '/transaction/closed',
            ...data
        });

        if(!saveTransaction){
            return res.send({
                success: false,
                message: "Unable to complete transaction"
            });
        }

        return res.send({
            success: true,
            message: "Successfully created transaction",
            data: {
                authorizationUrl: url,
                accessCode: accessCode,
                reference: accessCode,
                transactionId: data?.transId
            }
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: "false",
            message: error.message
        })
    }
};

const getCardDetails = async (req,res) => {
    const accessCode = req?.params?.ref;
    if(!accessCode){
        return res.render(views?.error);
    }

    const tnx = await Transaction.findOne({
        where: {
          accessCode: accessCode
        }
    });

    if(!tnx){
        return res.render(views?.error, {});
    }

    const transId = tnx.transId;

    const years = () => {
        let currentYear = new Date().getFullYear(), years = [];
        for(let i=0; i<= 10; i++){
           const val = (currentYear++).toString().slice(-2);
           years.push(val);
        }
        return years;
     }
    
    return res.render(views?.checkout, { 
        ref: transId, 
        amount: tnx.amount, 
        currency: tnx.currency, 
        domain: tnx.domain,
        name: tnx.name,
        years: years()
    });
    //__dirname : It will resolve to your project folder.
}

const getCardDetailsServerSide = async (req,res) => {
    const accessCode = req?.params?.ref;
    if(!accessCode){
        return res.send({
            success: 'false',
            message: 'Invalid transaction reference'
        });
    }

    const body = _.pick(req.body, 
        [
            'cardNumber', 'expiryDate', 'cvv'
        ]
    );

    const tnx = await Transaction.findOne({
        where: {
          accessCode: accessCode
        }
    });

    if(!tnx){
        return res.send({
            success: 'false',
            message: 'Invalid transaction!'
        });
    }

    const transId = tnx.transId;

    return res.send({
        success: 'false',
        message: tnx
    });
    //__dirname : It will resolve to your project folder.
}

const processPayment = async (req,res) => {
    //5123450000000008 2223000000000007 5111111111111118 2223000000000023
    const body = _.pick(req.body, ['cardNumber', 'cvv', 'expiryDate', 'transId']);
    if(!body?.transId){
        return res.send({
            success: false,
            message: "unable to process payment"
        });
    }

    const tnx = await Transaction.findOne({
        where: {
          transId: body.transId
        }
    });

    if(!tnx){
        return res.send({
            success: false,
            message: "unable to process payment"
        });
    }

    const payload_object = {
        transId: body.transId,
        domain: tnx.domain,
        cardNumber: body.cardNumber,
        expiryDate: body.expiryDate,
        cvv: body.cvv
    };

    const payload = Object.values(payload_object).join(':');

    const { data } = await axios.post('https://api.netpluspay.com/v2/pay', {
        clientData: btoa(payload),
        type: "PAY"
    });

    res.send({ ...data });
}

const requeryUrl = async (req, res) => {
    try {
        const transId = req?.params?.ref;
        
        const tnx = await Transaction.findOne({
            where: {
            transId: transId
            }
        });

        if(!tnx){
            return res.send({
                success: false,
                message: "unable to process payment"
            });
        }

        const url = `https://api.netpluspay.com/transactions/requery/${tnx.merchantId}/${transId}`
        const { data } = await axios.get(url);
        
        if(!data){
            return res.send({
                success: false,
                message: "Unable to complete transaction"
            });
        }

        return res.send({ 
            ...data 
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        });
    }
}

const checkoutFailed = async (req, res) => {
    return res.render(views?.checkoutFailed, { 
    });
}

const checkoutSuccess = async (req, res) => {
    return res.render(views?.checkoutSuccess, { 
    });
}

module.exports = {
  processOrder,
  processPayment,
  getCardDetails,
  requeryUrl,
  checkoutFailed,
  checkoutSuccess,
  getCardDetailsServerSide
};