/**
 * @ngdoc service
 * @name @ttcorestudio-MEANLib-browser-app.Session
 * @description
 * Service for session events
 */
app.service('Session', function ($rootScope, AUTH_EVENTS) {

    var self = this;

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
        self.destroy();
    });

    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
        self.destroy();
    });

    this.id = null;
    this.user = null;

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.Session#create
     * @methodOf @ttcorestudio-MEANLib-browser-app.Session
     *
     * @description
     * Creates a session and attaches id and user to service
     * @param {String} sessionId ID of session
     * @param {user} user User to associate with session
     */
    this.create = function (sessionId, user) {
        this.id = sessionId;
        this.user = user;
    };

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.Session#destroy
     * @methodOf @ttcorestudio-MEANLib-browser-app.Session
     *
     * @description
     * Destroys the session by setting this.id and this.user to null
     */
    this.destroy = function () {
        this.id = null;
        this.user = null;
    };

});
