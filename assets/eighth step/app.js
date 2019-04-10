(function () {
    'use strict';


    /**
     * remember_username
     */
    var remember_username = function () {
        if (window.localStorage && window.localStorage.getItem ('username')) {
            app.issues_form.find ('[name="username"]').val (window.localStorage.getItem ('username'));
        }    
    }

    
    // Submit the requests
    app.issues_form.submit (function () {
        
        // Remember the user name to improve the user experience
        var user_name = app.issues_form.find ('[name="username"]').val ();
        if (window.localStorage) {
            localStorage.setItem ('username', user_name);
        }
        
        
        // ...
        
        
        return false;
       
    });
    
    
    
    // Remember the user name for the first visit
    remember_username ();


})();
