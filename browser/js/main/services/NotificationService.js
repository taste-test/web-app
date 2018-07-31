/**
 * @ngdoc service
 * @name @ttcorestudio-MEANLib-browser-app.NotificationService
 * @description
 * Service for page notification
 */
app.service('NotificationService', function ($http, Session, $rootScope) {
    var self = this;

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.NotificationService#isAuthenticated
     * @methodOf @ttcorestudio-MEANLib-browser-app.NotificationService
     * @param {string} message - Message to show
     * @param {object} options - Options on how to show it.
     *
     * @description
     * Broadcasts "notify" from rootscope, with a message and a set of options.
     * @return {Boolean} Whether session has a user or not
     */
    self.notify=function(message,options){
        $rootScope.$broadcast("notify",message,options);
    };
});
