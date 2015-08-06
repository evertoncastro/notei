/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceUtil', function(){

    return{
        isEmpty: function(value){
            if(value==0 && typeof(value)=="number"){
                return false;
            }else if(value == undefined || value == null || value == '' || value==""){
                return true;
            }else{
                return false;
            }
        }
    }
});