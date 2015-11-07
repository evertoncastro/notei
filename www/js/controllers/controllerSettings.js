/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SettingsCtrl', SettingsCtrl);

    function SettingsCtrl($scope, serviceConfig, serviceValidation, serviceGA){

        $scope.init = function(){

            serviceConfig.getConfigNotes().then(
                function(obj){
                    $scope.configNotes = obj;
                }
            );

            //TODO: tests
            serviceGA.gaTrackerView('Settings view accessed');
        };

        $scope.setOldValue = function(value){
            $scope.oldValue = value;
        };


        //TODO: test
        $scope.updateConfigNotes = function(data, input){
            data = serviceValidation.validateInputConfig(data, input, $scope.oldValue);
            if(data.validation){
                serviceConfig.updateConfigNotes(data);
            }
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