/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SettingsCtrl', SettingsCtrl);

    function SettingsCtrl($scope, serviceConfig){

        $scope.init = function(){

            serviceConfig.getConfigNotes().then(
                function(obj){
                    $scope.configNotes = obj;
                }
            )

        };

        $scope.updateConfigNotes = function(data){
            serviceConfig.updateConfigNotes(data);
        };

        $scope.init();
    }