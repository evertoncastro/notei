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
            if(currentDB == undefined){
                currentDB = window.sqlitePlugin.openDatabase({
                    name: DATABASE_NAME,
                    createFromResource: PATH
                });
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
        }


    }
});