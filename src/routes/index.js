const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

const adminAuth = (req, res, next) => {
    if(!req.session.loggedin){
        return res.redirect('/admin/login');
    }

    next();
};

route.get("/", controllers.ExampleController.helloWorld);

route.post("/transaction/initialize", controllers.AppController.processOrder);

route.get('/checkout/:ref', controllers.AppController.getCardDetails);

route.post('/api/v1/pay', controllers.AppController.processPayment);

route.get('/transactions/requery/:ref', controllers.AppController.requeryUrl);

//Admin Routes
route.get("/admin/login", controllers.AdminController.login);
route.post("/admin/login", controllers.AdminController.loginUser);

route.get("/admin/dashboard", adminAuth, controllers.AdminController.dashboard);
route.get("/admin/transaction/:code", adminAuth, controllers.AdminController.singleTransaction);

route.get("/admin/users", adminAuth, controllers.AdminController.Users);
route.get("/admin/user/create", adminAuth, controllers.AdminController.createUser);
route.post("/admin/user/create",adminAuth, controllers.AdminController.saveUser);
route.get("/admin/user/:id", adminAuth, controllers.AdminController.userTransactions);
route.get("/admin/logout", controllers.AdminController.logout);

module.exports = route;