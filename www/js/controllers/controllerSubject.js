/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SubjectCtrl', SubjectCtrl);

function SubjectCtrl($scope){

    $scope.showSubject = false;
    $scope.init = function(){

    };

    $scope.openSubject = function(){
        $scope.showSubject = !$scope.showSubject;
    };

    $scope.init();

}