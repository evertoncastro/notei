/**
 * Created by everton on 27/07/15.
 */
var app = angular.module('anotei');

app.factory('factoryDB', function($cordovaSQLite){

    var currentDB = undefined;
    var DATABASE_NAME = 'anotei.db';
    var PATH = 'anotei.db';

    return{
        init: function(){
            if(currentDB == undefined){
                currentDB = window.sqlitePlugin.openDatabase({
                    name: DATABASE_NAME,
                    createFromResources: PATH
                });
            }
            return currentDB;
        },


    }
});