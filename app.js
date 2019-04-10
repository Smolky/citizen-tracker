(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */
    
    var app = {
        
        /** @var isLoading Boolean Used to know when the app is loading */
        isLoading: true,
        
        
        /** @var isOffline Boolean Used to know when the app is offline or not */
        isOffline: true,
        
        
        /** @var has_geolocation_permission String prompt|denied|granted */
        has_geolocation_permission: navigator.geolocation ? 'prompt' : 'not-available',
        
        
        /** @var geolocation_config Object Information about the request of geolocation of the user */
        geolocation_config: {
            maximumAge: 10 * 1000, 
            timeout: 5 * 1000, 
            enableHighAccuracy: true
        },
        
        
        /** @var api Object Information about where to send the issues tracked */
        api: {
            url: 'https://semantics.inf.um.es/joseagd/pwa/api/track.php'
        },
        
        
        // DOM elements
        html: $('html'),
        frame: $('#frame'),
        spinner: $('.loader'),
        container: $('.main'),
        camera: $('#camera'),
        issues_form: $('[name="issue-form"]'),
        
        
        /** @var messages Object A collection of messages */
        messages: {
            inform_user_geolocation: 'Hi! It seems this is your first report. We need information about where this issue has been tracked. The app will try to obtain your location from your device. Anyway, if you don\'t want to provide it, please attach some information concerning the place',
            
            report_success: 'Thanks. Your submission will be attended as soon as possible'
            
        }
        
    };
    
    
    // First, we tell our webapp that we have a service-worker
    // Notice how we test our browser if 'serviceWorkers' are 
    // supported. If not, our web app should behave as a regular web 
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register ('service-worker.js');
    }
    
    
    /** @var reader FileReader Will be used to read the content of the uploaded images */
    var reader = new FileReader ();
    
    
    // Bind the "load" event to the file reader
    // 
    // When this readers ends, it will render a thumbnail of the 
    // picture
    reader.addEventListener ('load', function () {
        app.issues_form.find ('[name="photo"]').val (reader.result);
        app.frame.attr ('src', reader.result);
    }, false);
    
    
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
    
    
    var remember_username = function () {
        if (window.localStorage && window.localStorage.getItem ('username')) {
            app.issues_form.find ('[name="username"]').val (window.localStorage.getItem ('username'));
        }    
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
        
        /** @var file File Get the first (and only) file selected */
        var file = e.target.files[0];
        
        
        // Check the file type do avoid non images
        if ( ! file.type.match ('image.*')) {
            vex.dialog.alert ('You need to uploaded an image');
            return;
        }
        
        
        // Start reading the the file
        reader.readAsDataURL (file);
        
        
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
            remember_username ();
        });
        
        
        return false;
       
    });
    
    
    // Remove loading
    if (app.isLoading) {
        app.spinner.attr ('hidden', true);
        app.container.removeAttr ('hidden');
        app.isLoading = false;
    }
    
    
    // Remember the user name
    remember_username ();

    
    
    // Check internet connection
    setInterval (function () { 
        app.isOffline = ! window.window.navigator.onLine;
        app.container.toggleClass ('state-offline', app.isOffline);
    }, 1 * 1000);

})();
