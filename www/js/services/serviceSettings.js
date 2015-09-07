/**
 * Created by everton on 05/09/15.
 */
var app = angular.module('anotei');

app.service('serviceConfig', function($q, factoryDatabase, serviceUtil,
                                        $cordovaDialogs, serviceConstants){
    var objNotes = {};

    return{
        getConfigNotes: function(){

            var defer = $q.defer();
            var sqlQuery = 'select * from config_notas limit 1';

            factoryDatabase.executeQuery(sqlQuery, undefined).then(
                function(result){
                    var object = {};

                    object.id = result.rows.item(0).id;
                    object.intervalo_de = result.rows.item(0).intervalo_de;
                    object.intervalo_para = result.rows.item(0).intervalo_para;
                    object.media_minima = result.rows.item(0).media_minima;

                    defer.resolve(object);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        updateConfigNotes: function(data){
            var defer = $q.defer();
            var validator = false;
            if(serviceUtil.isEmpty(data.intervalo_de)){validator=true}
            else if(serviceUtil.isEmpty(data.intervalo_para)){validator=true}
            else if(serviceUtil.isEmpty(data.media_minima)){validator=true}

            if(validator==true){
                $cordovaDialogs.alert(serviceConstants.MSG_EMPTY_CONFIG_NOTES.MSG,
                    serviceConstants.MSG_EMPTY_CONFIG_NOTES.ALERT,
                    serviceConstants.MSG_EMPTY_CONFIG_NOTES.BUTTON)
            }else if(validator==false){
                var sqlQuery = 'update config_notas ' +
                    'set intervalo_de = ?, intervalo_para = ?, media_minima = ? ' +
                    'where id = 1';
                var params = [data.intervalo_de, data.intervalo_para, data.media_minima];

                factoryDatabase.executeQuery(sqlQuery, params).then(
                    function(result){
                        defer.resolve(result);
                    },
                    function(error){
                        defer.reject(error);
                    }
                );
            }
            return defer.promise;
        },

        setObjNotes: function(obj){
            objNotes = obj;
        },

        getObjNotes: function(){
            return objNotes;
        }
    }
});
