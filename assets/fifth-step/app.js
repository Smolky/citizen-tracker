(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */
    
    var app = {
        
        /** @var has_geolocation_permission String prompt|denied|granted */
        has_geolocation_permission: navigator.geolocation ? 'prompt' : 'not-available',
        
        
        /** @var geolocation_config Object Information about the request of geolocation of the user */
        geolocation_config: {
            maximumAge: 10 * 1000, 
            timeout: 5 * 1000, 
            enableHighAccuracy: true
        },
        
        
        /** @var messages Object A collection of messages */
        messages: {
            inform_user_geolocation: 'Hi! It seems this is your first report. We need information about where this issue has been tracked. The app will try to obtain your location from your device. Anyway, if you don\'t want to provide it, please attach some information concerning the place',
            
            report_success: 'Thanks. Your submission will be attended as soon as possible'
            
        }
        
    };
    
    
    
    /**
     * geolocation_success
     *
     * This function is the callback when geolocation
     * has succeded. Results in a better user experience 
     * because user does not have to type manually 
     * its position.
     *
     * @param position Object 
     */
    var geolocation_success = function (position) {
    
        // User has provided geolocation
        app.html.addClass ('geolocation-state');
        
    
        /** @var latitude */
        var latitude = position.coords.latitude.toFixed (4);
        
        
        /** @var longitude */
        var longitude = position.coords.longitude.toFixed (4)
        
        
        /** @var accuracy */
        var accuracy = position.coords.accuracy.toFixed (4);
    
    
        // Update values in the form
        app.issues_form
            .find ('[name="latitude"]').val (latitude).end ()
            .find ('[name="longitude"]').val (longitude).end ()
            .find ('[name="accuracy"]').val (accuracy)
        ;    
    
    }
    
    
    // Remember previous permission
    if (navigator.permissions) {
        navigator.permissions.query ({ name: 'geolocation' }).then (function (permission) {
            app.has_geolocation_permission = permission.state;
        });
    }
    

    
    /**
     * geolocation_error
     *
     * error.code can be:
     *   0: unknown error
     *   1: permission denied
     *   2: position unavailable (error response from location provider)
     *   3: timed out
     *
     * @param position Object 
     */
    var geolocation_error = function (error) {
        app.html.addClass ('no-geolocation-state');
    }
    

    // Bind on change event to the input type file
    // This is when the user starts to track a new event.
    app.camera.change (function (e) {
        
        // ...
        
        
        // While the other file reader is working, we start to 
        // request information about the place
        // 
        // We are going to remember information about the user
        switch (app.has_geolocation_permission) {
        
            // Prompting the user. Inform about why its location it is needed?
            case 'prompt':
                vex.dialog.alert ({
                    message: app.messages.inform_user_geolocation,
                    callback: function () {
                        navigator.geolocation.getCurrentPosition (geolocation_success, geolocation_error, app.geolocation_config)
                    }
                });
                break;
                
            // Denied or not available
            default:
            case 'denied':
            case 'not-available':
                app.html.addClass ('no-geolocation-state');
                break;
                
            // Granted. Automatically obtain information
            case 'granted':
                callback: navigator.geolocation.getCurrentPosition (geolocation_success, geolocation_error, app.geolocation_config);
                break;
            
        }
    });
    
    
    
    // Remove loading
    if (app.isLoading) {
        app.spinner.attr ('hidden', true);
        app.container.removeAttr ('hidden');
        app.isLoading = false;
    }

})();
