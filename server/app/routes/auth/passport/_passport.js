const needle = require("needle");
const Promise = require("bluebird");
const jwt = require("jsonwebtoken");

let User = require("server/db/models/User/_User");

let passport = {};

passport.loginFromSso = function(req, ssoToken) {
    return new Promise(function(resolve, reject) {
        passport.checkSsoToken(ssoToken).then(processSSOLogin);

        function processSSOLogin(ssoUser) {
            if (ssoUser && ssoUser._id) {
                if (req.user && req.user.ssoId === ssoUser._id) {
                    resolve(req.user);
                } else {
                    User.matchOrCreateFromSso(ssoUser, function(err, user) {
                        err
                            ? logout(err)
                            : login(user);
                    });

                }
            } else {
                reject("No user");
            }

            function logout(noMatchErr) {
                if (req.user)
                    req.logout();
                reject(noMatchErr || "User not a match, logged out");
            }
            function login(user) {
                req.login(user, function(err) {
                    if (err)
                        logout();
                    else
                        resolveUser(user);
                    }
                );
            }
            function resolveUser(localUser) {
                localUser.sso = ssoUser;
                localUser.ssoToken = ssoToken;
                localUser.apiTokens = [];
                localUser.save(function(err) {
                    if (!err) {
                        resolve(localUser);
                    } else {
                        reject(err);
                    }
                });
            }
        }
    });
};

passport.checkSsoToken = function(token) {
    return new Promise(function(resolve, reject) {
        let verified = jwt.verify(token, process.env.CORE_SSO_JWT_SECRET);
        if (verified.id) {
            needle.post(process.env.CORE_SSO_URL + "/api/users/authenticate/token/", {
                applicationPassword: process.env.CORE_SSO_API_SECRET,
                token: token
            }, function(err, response) {
                (!err && response.body && response.body.success)
                    ? resolve(response.body.user)
                    : reject(err);
            });
        } else {
            reject("Invalid token received.");
        }
    });
};

passport.validateApiRequest = function(req, res, next) {
    if (req.isAuthenticated()) {
        // console.log("authenticated!");
        return next();
    }

    let token = null;

    if (req.headers.authorization && req.headers.authorization.indexOf("Basic") === 0) {
        token = req.headers.authorization.replace("Basic ", "");
    } else if (req.session && req.session.token) {
        token = req.session.token;
    }

    if (token) {
        //Only will be used if we are logging in to API directly
        // User.verifyApiToken(token).then(function(user) {
        //     req.user = user;
        //     if (req.session & req.session.token)
        //         req.session.token = null;
        //     next();
        // }).catch(function(err) {
        //     return res.send(err);
        // });
        res.send("API Token is not valid");
    } else {
        res.send("Authorization error: Missing API session token")
    }
}

module.exports = passport;
