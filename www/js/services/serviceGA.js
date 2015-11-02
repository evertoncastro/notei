/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceGA', function($gaWrapper){

    return{

        gaTrackerView: function(view){
            if(window.cordova){
                $gaWrapper.trackView(view);
            }
        }
    }
});