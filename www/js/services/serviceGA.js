/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceGA', function($gaWrapper){

    return{

        gaTrackerView: function(view){
            if(window.cordova){
                $gaWrapper.trackView(view);
                console.log('GA tracking view: '+view);
            }
        },

        gaTrackerEvent: function(cat, event, desc, timmer){
            if(window.cordova){
                $gaWrapper.trackEvent(cat, event, desc, timmer);
                console.log('GA tracking event: '+cat, event, desc, timmer);
            }
        }
    }
});