var MEANLib = require("server/mean-lib").module;
var router = MEANLib.modules.express.Router();
var passportConf = MEANLib.server.config.passport();

/*
 █████  ██████  ██      █████  ██    ██ ████████ ██   ██
██   ██ ██   ██ ██     ██   ██ ██    ██    ██    ██   ██
███████ ██████  ██     ███████ ██    ██    ██    ███████
██   ██ ██      ██     ██   ██ ██    ██    ██    ██   ██
██   ██ ██      ██     ██   ██  ██████     ██    ██   ██
*/

router.post('/authenticate/ssotoken', passportConf.validateApplicationRequest, function (req, res) {
    passportConf.ssoLogin(req, req.body.token).then(function (user) {
        user.grantApiToken().then(function (token) {
            return res.status(200).json({
                success: true,
                token: token
            });
        }).catch(failToLogin);
    }).catch(failToLogin);

    function failToLogin() {
        passportConf.thouShallNotPass(res, "Login failed");
    }
});

router.post("/authenticate/end", function (req, res) {
    passportConf.endApiSession(req.body.token).then(function (response) {
        return res.send(response);
    });
});

/*
 ██████  ████████ ██   ██ ███████ ██████  ███████
██    ██    ██    ██   ██ ██      ██   ██ ██
██    ██    ██    ███████ █████   ██████  ███████
██    ██    ██    ██   ██ ██      ██   ██      ██
 ██████     ██    ██   ██ ███████ ██   ██ ███████
*/

router.use('/images', require('./images/_images'));
router.use('/profiles', require('./profiles/_profiles'));
router.use('/counter', require('./counter/_counter'));

router.use('/projects', passportConf.validateApiRequest, require('./projects/_projects'));

router.use('/project', passportConf.validateApiRequest, require('./project/_project'));

// router.use('/db', passportConf.validateApiRequest, require('./db/_db'));

module.exports = router;
