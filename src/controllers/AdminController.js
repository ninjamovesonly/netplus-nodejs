"use strict";
const { Admin, Transaction, User } = require("../models");
const { guid, orderId } = require("../util");
const views = require("../views");
const _ = require("lodash");

const login = async (req, res) => {
    if(req.session.loggedin){
        return res.redirect('/admin/dashboard');
    }

    return res.render(views?.admin?.login);
};

const loginUser = async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const admin = await Admin.findOne({
        where: {
            email: body?.email
        }
    });
    if(!admin){
        return res.redirect('/admin/login');
    }

    if(admin.password !== body?.password){
        return res.redirect('/admin/login');
    }

    req.session.loggedin = true;
    req.session.admin = JSON.stringify(admin);
    // Redirect to home page
    return res.redirect("/admin/dashboard");
};

const dashboard = async (req, res) => {
    

    let transactions = await Transaction.findAll();

    transactions = await Promise.all(transactions?.map(async (transaction) => {
        const item = transaction.dataValues;
        return { 
            ...item, 
            updatedAt: new Date(item.updatedAt).toDateString()
        }
    }));

    return res.render(views?.admin?.dashboard, {
        transactions: transactions.reverse()
    });
};

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
    

    const form = _.pick(req.body, ['name', 'email']);

    let user = await User.findOne({
        where: { email: form?.email }
    });

    if(user){
        return res.redirect('/admin/user/create?error=1');
    }

    user = await User.create({
        id: guid(),
        name: form?.name,
        email: form?.email,
        key: orderId(16)
    });

    return res.redirect('/admin/users');
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

const logout = async (req, res) => {
    req.session.loggedin = false;
    req.session.admin = null;
    // Redirect to home page
    return res.redirect("/admin/login");
}

module.exports = {
  login, dashboard, loginUser, singleTransaction, Users, createUser, saveUser, userTransactions, logout
};
