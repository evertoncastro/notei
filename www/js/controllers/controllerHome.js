/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, serviceGA){

    $scope.init = function(){

        serviceGA.gaTrackerView('Home');

    };

    $scope.init();
}