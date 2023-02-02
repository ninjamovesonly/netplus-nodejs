const adminAuth = (req, res, next) => {
    if(!req.session.loggedin){
        return res.redirect('/admin/login');
    }

    if(!req.session.admin){
        return res.redirect('/merchants/login');
    }

    next();
};

const userAuth = (req, res, next) => {
    if(!req.session.loggedin){
        return res.redirect('/merchants/login');
    }

    if(!req.session.user){
        return res.redirect('/merchants/login');
    }

    next();
};

module.exports = {
    adminAuth,
    userAuth
}