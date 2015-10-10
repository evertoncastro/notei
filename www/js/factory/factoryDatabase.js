/**
 * Created by everton on 27/07/15.
 */
var app = angular.module('anotei');

app.factory('factoryDatabase', function($cordovaSQLite, $q){

    var currentDB = undefined;
    var DATABASE_NAME = 'anotei.db';
    var PATH = 'anotei.db';

    return{
        init: function(){
            if(window.cordova){
                if(currentDB == undefined){
                    currentDB = window.sqlitePlugin.openDatabase({
                        name: DATABASE_NAME,
                        createFromResource: PATH
                    });
                }
            }else if(!window.cordova){
                // open in WEB mode: database name, description is unecessary and size is fixed
                currentDB = window.openDatabase(DATABASE_NAME, '1.0', '', 2 * 1024 * 1024);
            }
            return currentDB;
        },

        executeQuery: function(deliveredQuery, fields){
            var defer = $q.defer();


            var resp = $cordovaSQLite.execute(currentDB, deliveredQuery, fields);
            resp.then(
                function(execution){
                    defer.resolve(execution);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        //TODO: test
        setupWEB: function (script) {
            if (!window.cordova) {
                var splitted = script.split(';');

                currentDB.transaction(function (tx) {
                    for (var i = 0; currentDB && splitted && i < splitted.length; i++) {
                        tx.executeSql(splitted[i]); // execute all tables....
                    }
                });
            }
        }
    }
});