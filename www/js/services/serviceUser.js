/**
 * Created by everton on 05/09/15.
 */
var app = angular.module('anotei');

app.service('serviceUser', function($q, factoryDatabase){
    var userInfo = {};

    return{

        getUserInfo: function(){
            return userInfo;
        },

        setUserInfo: function(user){
            userInfo = user;
        },

        saveUserInfo: function(){
            var defer = $q.defer();

            var sqlQuery = 'insert into user_info (date_register) values (?)';
            var dateRegister = new Date();
            var param = [dateRegister];
            factoryDatabase.executeQuery(sqlQuery, param).then(
                function(result){
                    if(result.rowsAffected>0){
                        defer.resolve({date_register: dateRegister});
                    }else{
                        defer.resolve(undefined);
                    }
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        loadUserInfo: function(){
            var self = this;

            var defer = $q.defer();
            var sqlQuery = 'select date_register from user_info limit 1';
            factoryDatabase.executeQuery(sqlQuery, undefined).then(
                function(result){
                    var object = {date_register: undefined};

                    for(var i = 0; i < result.rows.length; i++){
                        object.date_register = result.rows.item(0).date_register;
                    }

                    if(!object.date_register){
                        self.saveUserInfo().then(
                            function(resp){
                                self.setUserInfo(resp);
                                defer.resolve(resp);
                            }
                        );
                    }else{
                        self.setUserInfo(object);
                        defer.resolve(object);
                    }
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        }
    }
});
