(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */
    
    var app = {
        /** @var isOffline Boolean Used to know when the app is offline or not */
        isOffline: true,
    };

    
    
    // Check internet connection
    setInterval (function () { 
        app.isOffline = ! window.window.navigator.onLine;
        app.container.toggleClass ('state-offline', app.isOffline);
    }, 1 * 1000);

})();
