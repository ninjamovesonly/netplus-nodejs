"use strict";
const { Transaction, User } = require("../models");
const { guid, orderId } = require("../util");
const views = require("../views");
const _ = require("lodash");
const axios = require('axios');

const login = async (req, res) => {
    if(req.session.loggedin){
        return res.redirect('/users/dashboard');
    }


    return res.render(views?.users?.login);
};

const loginUser = async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findOne({
        where: {
            email: body?.email
        }
    });
    if(!user){
        return res.redirect('/merchants/login');
    }

    if(user.password !== body?.password){
        return res.redirect('/merchants/login');
    }

    req.session.loggedin = true;
    req.session.user = JSON.stringify(user);
    // Redirect to home page
    return res.redirect("/merchants/dashboard");
};

const dashboard = async (req, res) => {
    try {
        const user = JSON.parse(req.session.user);

        let transactions = await Transaction.findAll({
            where: {
                userKey: user?.key
            }
        });

        if(!transactions){
            return res.render(views?.error);
        }

        let customers = await Transaction.findAll({
            attributes: ['email'],
            group: ['email']
        });

        let processed = transactions.reduce((prev, current) => {
            return prev + parseFloat(current.amount);
        }, 0);

        let successful_transactions = 0;
        transactions = await Promise.all(transactions?.map(async (transaction) => {
            const item = transaction.dataValues;
            const url = `https://api.netpluspay.com/transactions/requery/${item.merchantId}/${item.transId}`
            const { data: state } = await axios.get(url);
            if(state.code === '00') successful_transactions += 1; 

            return { 
                ...item, 
                state,
                updatedAt: new Date(item.updatedAt).toDateString()
            }
        }));

        return res.render(views?.users?.dashboard, {
            transactions: transactions.reverse(),
            count: transactions.length,
            processed,
            successful_transactions,
            customers: customers.length
        });
    } catch (error) {
        console.log(error.message)
        return res.render(views?.users?.dashboard, {
            transactions: [],
            count: 0,
            processed: 0,
            successful_transactions: 0,
            customers: 0
        });
    }
};

const allTransactions = async (req, res) => {
    const user = JSON.parse(req.session.user);

    let transactions = await Transaction.findAll({
        where: {
            userKey: user?.key
        }
    });

    if(!transactions){
        return res.render(views?.error);
    }

    transactions = await Promise.all(transactions?.map(async (transaction) => {
        const item = transaction.dataValues;
        return { 
            ...item, 
            updatedAt: new Date(item.updatedAt).toDateString()
        }
    }));

    return res.render(views?.users?.dashboard, {
        transactions: transactions.reverse()
    });
}

const userTransactions = async (req, res) => {
    const userId = req?.params?.id || null;
    const user = await User.findOne({
        where: { id: userId }
    });
    if(!user){
        return res.render(views.error);
    }

    let transactions = await Transaction.findAll({
        where: { userKey: user.key }
    });

    transactions = await Promise.all(transactions?.map(async (transaction) => {
        const item = transaction.dataValues;
        return { 
            ...item, 
            updatedAt: new Date(item.updatedAt).toDateString()
        }
    }));

    return res.render(views?.admin?.userTransactions, {
        transactions: transactions.reverse(),
        user
    });
}

const singleTransaction = async (req, res) => {
    
    const code = req?.params?.code;
    const transaction = await Transaction.findOne({
        where: { accessCode: code }
    });
    if(!transaction){
        return res.render(views.error);
    }

    const url = `https://api.netpluspay.com/transactions/requery/${transaction.merchantId}/${transaction.transId}`
    const { data: state } = await axios.get(url);
    transaction.state = state;

    return res.render(views.users.transaction, {
        transaction
    });
}

const Users = async (req, res) => {
    let users = await User.findAll({
    });

    if(!users){
        return res.render(views.error);
    }

    users = await Promise.all(users?.map(async (user) => {
        const item = user.dataValues;
        return { 
            ...item, 
            updatedAt: new Date(item.updatedAt).toDateString()
        }
    }));

    return res.render(views.admin.users, {
        users
    });
}

const profile = async (req, res) => {
    const user_session = JSON.parse(req?.session?.user);
    const user_id = user_session?.id;
    const user = await User.findOne({
        where: {
            id: user_id
        }
    });

    if(!user){
        return res.render(views.error);
    }

    let error = req?.query?.error;
    if(error == '1'){
        error = 'User does not exist'
    }

    return res.render(views.users.profile, {
        user,
        error
    });
}

const saveUser = async (req, res) => {
    
    const form = _.pick(req.body, ['name', 'password']);

    const user_session = JSON.parse(req?.session?.user);
    const user_id = user_session?.id;
    const user = await User.findOne({
        where: {
            id: user_id
        }
    });

    if(!user){
        return res.redirect('/merchants/profile?error=1');
    }

    await User.update({
        name: form?.name,
        password: form?.password
    }, { where: { id: user?.id }});

    return res.redirect('/merchants/profile');
}

const customers = async (req, res) => {
    try {
        const user = JSON.parse(req.session.user);

        let customers = await Transaction.findAll({
            where: {
                userKey: user?.key
            },
            attributes: [
                'name', 'email'
            ],
            group: ['email']
        });

        if(!customers){
            return res.render(views?.error);
        }

        return res.render(views?.users?.customers, {
            customers: customers
        });
    } catch (error) {
        return res.render(views?.users?.customers, {
            transactions: [],
            count: 0,
            processed: 0,
            successful_transactions: 0,
            customers: 0
        });
    }
};

const logout = async (req, res) => {
    req.session.loggedin = false;
    req.session.user = null;
    // Redirect to home page
    return res.redirect("/merchants/login");
}

module.exports = {
  login, dashboard, loginUser, singleTransaction, Users, saveUser, userTransactions, allTransactions, logout, profile, customers
};
