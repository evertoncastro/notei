/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SettingsCtrl', SettingsCtrl);

    function SettingsCtrl($scope, serviceConfig, serviceValidation){

        $scope.init = function(){

            serviceConfig.getConfigNotes().then(
                function(obj){
                    $scope.configNotes = obj;
                }
            )

        };


        //TODO: test
        $scope.updateConfigNotes = function(data, input){
            data = serviceValidation.validateInputConfig(data, input);
            serviceConfig.updateConfigNotes(data);
        };


        //TODO: test
        $scope.$on('$ionicView.afterLeave', function(){
            serviceConfig.getConfigNotes().then(
                function(obj){
                    serviceConfig.setObjNotes(obj);
                }
            );
        });

        $scope.init();
    }