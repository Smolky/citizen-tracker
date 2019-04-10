/** @TODO Inlcude this info in the app.js */
// First, we tell our webapp that we have a service-worker
// Notice how we test our browser if 'serviceWorkers' are 
// supported. If not, our web app should behave as a regular web 
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register ('service-worker.js');
}
