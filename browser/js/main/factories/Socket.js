/**
 * @ngdoc service
 * @name @ttcorestudio-MEANLib-browser-app.service:Socket
 * @function
 * @description
 * Socket service
 */
app.factory('Socket', function () {
    if (!window.io) throw new Error('socket.io not found!');
    return window.io(window.location.origin);
});
