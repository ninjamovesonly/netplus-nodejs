"use strict";
const { Admin, Transaction, User } = require("../models");
const { guid, orderId } = require("../util");
const views = require("../views");
const _ = require("lodash");

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

    return res.render(views.admin.transaction, {
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

const createUser = async (req, res) => {
    const users = await User.findAll({
    });

    if(!users){
        return res.render(views.error);
    }

    let error = req?.query?.error;
    if(error == '1'){
        error = 'User with this email already exists'
    }

    return res.render(views.admin.createUser, {
        users,
        error
    });
}

const saveUser = async (req, res) => {
    
    const form = _.pick(req.body, ['name', 'email', 'merchantid']);

    let user = await User.findOne({
        where: { email: form?.email }
    });

    if(user){
        return res.redirect('/merchants/user/create?error=1');
    }

    user = await User.create({
        id: guid(),
        name: form?.name,
        email: form?.email,
        merchantid: form?.merchantid,
        key: orderId(16),
    });

    return res.redirect('/merchants/users');
}

const logout = async (req, res) => {
    req.session.loggedin = false;
    req.session.user = null;
    // Redirect to home page
    return res.redirect("/merchants/login");
}

module.exports = {
  login, dashboard, loginUser, singleTransaction, Users, createUser, saveUser, userTransactions, allTransactions, logout
};
