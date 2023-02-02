const views = {
    home: __dirname + "/../views/home.html",
    checkout: __dirname + "/../views/index.html",
    checkoutFailed: __dirname + "/../views/failed.html",
    checkoutSuccess: __dirname + "/../views/success.html",
    error: __dirname + "/../views/404.html",
    admin: {
        login: __dirname + "/../views/admin/login.html",
        dashboard: __dirname + "/../views/admin/dashboard.html",
        allTransactions: __dirname + "/../views/admin/allTransactions.html",
        transaction: __dirname + "/../views/admin/transaction.html",
        users: __dirname + "/../views/admin/users.html",
        createUser: __dirname + "/../views/admin/createUser.html",
        userTransactions: __dirname + "/../views/admin/userTransactions.html"
    },
    users: {
        login: __dirname + "/../views/users/login.html",
        dashboard: __dirname + "/../views/users/dashboard.html",
        allTransactions: __dirname + "/../views/users/allTransactions.html",
        transaction: __dirname + "/../views/users/transaction.html",
        users: __dirname + "/../views/users/users.html",
        createUser: __dirname + "/../views/users/createUser.html",
        userTransactions: __dirname + "/../views/users/userTransactions.html"
    },
    docs: {
        invincible: __dirname + "/../views/docs/invincible.html",
        checkout: __dirname + "/../views/docs/checkout.html"
    }
};

module.exports = {
    ...views
};