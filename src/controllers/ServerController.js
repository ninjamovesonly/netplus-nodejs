"use strict";
const { default: axios } = require('axios');
const _ = require('lodash');
const util = require('../util');
const views = require('../views');
const logger = require("../util/log");
const { Transaction, User, MerchantId } = require("../models");

const processOrder = async (req, res) => {
    try {
        //5123450000000008 2223000000000007 5111111111111118 2223000000000023
        const accessCode = req?.params?.ref;
        if(!accessCode){
            return res.send({
                success: false,
                message: "invalid reference"
            });
        }

        const tnx = await Transaction.findOne({
            where: {
              accessCode: accessCode
            }
        });

        if(!tnx){
            return res.send({
                success: false,
                message: "invalid reference"
            });
        }

        const transId = tnx.transId;

        const body = _.pick(req.body, ['cardNumber', 'cvv', 'expiryDate']);

        if(!tnx){
            return res.send({
                success: false,
                message: "unable to process payment"
            });
        }

        const payload_object = {
            transId: transId,
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

        const { TermUrl, ...remainder } = data;

        return res.send({ ...remainder });
    } catch (error) {
logger(error);
        return res.send({
            message: error.message
        })
    }
};

const requeryUrl = async (req, res) => {
    try {
        const accessCode = req?.params?.ref;
        if(!accessCode){
            return res.send({
                success: false,
                message: "invalid reference"
            });
        }

        const tnx = await Transaction.findOne({
            where: {
              accessCode: accessCode
            }
        });
    
        if(!tnx){
            return res.send({
                success: false,
                message: "invalid reference"
            });
        }
    
        const transId = tnx.transId;

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



module.exports = {
    processOrder,
    requeryUrl
};
