/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, serviceConfig){

    $scope.init = function(){
        //TODO: I think it wont be used
        /*serviceConfig.getConfigNotes().then(
            function(obj){
                serviceConfig.setObjNotes(obj);
            }
        );*/
    };

    //$scope.init();

}