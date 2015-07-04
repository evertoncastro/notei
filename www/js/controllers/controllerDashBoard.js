/**
 * Created by everton on 04/07/15.
 */
angular.module('starter').controller('DashBoardCtrl', DashBoardCtrl);

function DashBoardCtrl($scope){

    $scope.showSubject = false;
    $scope.init = function(){

    };

    $scope.openSubject = function(){
        $scope.showSubject = !$scope.showSubject;
    };

    $scope.init();

}