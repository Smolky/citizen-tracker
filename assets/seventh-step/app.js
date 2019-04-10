(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */
    
    var app = {
        
        /** @var api Object Information about where to send the issues tracked */
        api: {
            url: 'https://semantics.inf.um.es/joseagd/pwa/api/track.php'
        },
        
        
        // DOM elements
        issues_form: $('[name="issue-form"]'),
        
        
        /** @var messages Object A collection of messages */
        messages: {
            report_success: 'Thanks. Your submission will be attended as soon as possible'
        }
        
    };
    
    
    
    // Submit the requests
    app.issues_form.submit (function () {
        
        // Remember the user name to improve the user experience
        var user_name = app.issues_form.find ('[name="username"]').val ();
        if (window.localStorage) {
            localStorage.setItem ('username', user_name);
        }
        
        
        // Send the POST request
        $.post (app.api.url, app.issues_form.serialize (), function (data) {
            
            // Prompt success
            vex.dialog.alert (app.messages.report_success)
            
            
            // Reset form
            app.issues_form.trigger ('reset');
            app.frame.attr ('src', '');
        });
        
        
        return false;
       
    });
    

})();
