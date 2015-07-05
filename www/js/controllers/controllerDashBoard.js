/**
 * Created by everton on 04/07/15.
 */
angular.module('starter').controller('DashBoardCtrl', DashBoardCtrl);

function DashBoardCtrl($scope){

    $scope.showSubject = false;
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.init = function(){

    };

    $scope.openSubject = function(){
      $scope.showSubject = !$scope.showSubject;
    };

    $scope.openLeftTab = function(){
        $scope.showLeftTab = !$scope.showLeftTab;
        $scope.showRightTab = !$scope.showRightTab;
        console.log('Left');
    };

    $scope.openRightTab = function(){
        $scope.showRightTab = !$scope.showRightTab;
        $scope.showLeftTab = !$scope.showLeftTab;
        console.log('Right');
    };

    $scope.init();

}