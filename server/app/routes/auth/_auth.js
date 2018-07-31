'use strict';

const express = require("express");
const router = express.Router();
const middlewareRouter = express.Router();
const qs = require("querystring");

module.exports = middlewareRouter;

let passport = require("./passport/_passport");

middlewareRouter.use("/auth", function(req, res, next) {
    req.session.returnTo = "//" + req.headers.host;
    // console.log(req.session, req.originalUrl);
    return next();
}, router);

router.get("/login", function(req, res) {
    // if already logged in, go from whence we came
    if (req.user && !req.query.token) {
        return res.redirect("back");
    }

    if (req.query.token) {
        //logged in and got an SSO token
        passport.loginFromSso(req, req.query.token).then(function(appUser) {
            var returnTo = req.session.returnTo;
            req.session.returnTo = undefined;
            return res.redirect(returnTo);
        }).catch(function(err) {
            if (err)
                return res.redirect("back");
            }
        )

    } else {
        //login through SSO
        var returnPath = qs.escape("http://" + req.headers.host + req.originalUrl);
        return res.redirect(process.env.CORE_SSO_URL + "/user/authenticate/" + returnPath);
    }
});

router.get("/logout", function(req, res) {
    req.session.token = null;
    req.logout();
    var returnPath = qs.escape("http://" + req.headers.host);
    return res.redirect(process.env.CORE_SSO_URL + "/user/logout/" + returnPath);
});
