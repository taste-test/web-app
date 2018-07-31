/**
 * @ngdoc service
 * @name @ttcorestudio-MEANLib-browser-app.AuthService
 * @description
 * Service for authorization events
 */
app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

    var AuthService = this;

    var sessionAnswer = undefined;

    function onSuccessfulLogin(response) {
        gettingSession = false;
        var data = response.data;
        Session.create(data.id, data.user);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $rootScope.USER = data.user;
        sessionAnswer = data.user;
        return sessionAnswer;
    }

    function onUnsuccessfulLogin(){
        gettingSession = false;
        sessionAnswer = null;
        return sessionAnswer;
    }

    function piggyBackOnSuccessfulLogin(){
        return new Promise(function(resolve,reject){

            checkData();

            function checkData(){
                if(!gettingSession) return resolve(sessionAnswer);
                setTimeout(function () {
                    checkData();
                }, 10);
            }
        });
    }

    var gettingSession = false;

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.AuthService#isAuthenticated
     * @methodOf @ttcorestudio-MEANLib-browser-app.AuthService
     *
     * @description
     * Uses the session factory to see if an
     * authenticated user is currently registered.
     * @return {Boolean} Whether session has a user or not
     */
    AuthService.isAuthenticated = function () {
        return !!Session.user;
    };

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.AuthService#getLoggedInUser
     * @methodOf @ttcorestudio-MEANLib-browser-app.AuthService
     *
     * @description
     * Gets the currently logged in user
     * @param {Boolean} fromServer If false, uses cached value
     * @return {user} Logged in user, or null if does not exist
     */
    AuthService.getLoggedInUser = function (fromServer) {

        // If an authenticated session exists, we
        // return the user attached to that session
        // with a promise. This ensures that we can
        // always interface with this method asynchronously.

        // Optionally, if true is given as the fromServer parameter,
        // then this cached value will not be used.

        if (AuthService.isAuthenticated() && fromServer !== true) {
            return $q.when(Session.user);
        }

        if(gettingSession) {
            return piggyBackOnSuccessfulLogin();
        }

        gettingSession = true;

        // Make request GET /session.
        // If it returns a user, call onSuccessfulLogin with the response.
        // If it returns a 401 response, we catch it and instead resolve to null.
        return $http.get('/session').then(onSuccessfulLogin).catch(onUnsuccessfulLogin);

    };

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.AuthService#getGravatar
     * @methodOf @ttcorestudio-MEANLib-browser-app.AuthService
     *
     * @description
     * Gets gravatar for user
     * @param {Number} size Size of gravar, in pixels across
     * @return {String} URL of gravatar
     */
    AuthService.getGravatar = function (size) {
        size = size || undefined;
        return $http.get('/users/gravatar/' + size).then(function (response) {
            return response.data;
        }).catch(function () {
            return null;
        });
    };

});
