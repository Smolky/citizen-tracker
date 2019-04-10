(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */
    
    var app = {
        
        /** @var isLoading Boolean Used to know when the app is loading */
        isLoading: true,
        
        
        // DOM elements
        html: $('html'),
        spinner: $('.loader'),
        container: $('.main'),
    };
    
    
    
    
    // Remove loading
    if (app.isLoading) {
        app.spinner.attr ('hidden', true);
        app.container.removeAttr ('hidden');
        app.isLoading = false;
    }

})();
