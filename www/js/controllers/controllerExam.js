/**
 * Created by everton on 04/07/15.
 */
angular.module('starter').controller('ExamCtrl', ExamCtrl);

function ExamCtrl($scope){

    $scope.showExam = false;
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.init = function(){

    };

    $scope.openExam = function(){
      $scope.showExam = !$scope.showExam;
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