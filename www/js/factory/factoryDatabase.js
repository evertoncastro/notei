/**
 * Created by everton on 27/07/15.
 */
var app = angular.module('anotei');

app.factory('factoryDatabase', function($cordovaSQLite, $ionicLoading, $q){

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

        executeQuery: function(deliveredQuery, fields){
            var defer = $q.defer();
            $ionicLoading.show();

            var resp = $cordovaSQLite.execute(currentDB, deliveredQuery, fields);
            resp.then(
                function(execution){
                    defer.resolve(execution);
                    $ionicLoading.hide();
                },
                function(error){
                    $ionicLoading.hide();
                    defer.reject(error);
                    console.log(error);
                }
            );
            return defer.promise;
        }


    }
});