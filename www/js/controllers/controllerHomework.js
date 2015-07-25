/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('HomeworkCtrl', HomeworkCtrl);

function HomeworkCtrl($scope){

    $scope.showHomework = false;
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.init = function(){

    };

    $scope.openHomework = function(){
      $scope.showHomework = !$scope.showHomework;
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