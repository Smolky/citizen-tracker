/** @TODO Include the parts missing in the main js */
(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */
    
    var app = {
        
        /** ... */
        
        // DOM elements
        frame: $('#frame'),
        camera: $('#camera'),
        issues_form: $('[name="issue-form"]'),
    };
    

    
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
        
    });
})();
