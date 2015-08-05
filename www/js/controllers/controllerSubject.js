/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SubjectCtrl', SubjectCtrl);

function SubjectCtrl($scope, serviceSubject){

    $scope.showSubject = false;
    $scope.subject_id = null;

    $scope.init = function(){
        var resp = serviceSubject.getSubjects();
        resp.then(function(list){
            $scope.data = {};
            $scope.data.subjectList = list;
        });
    };

    $scope.openSubject = function(id){
        $scope.subject_id = id;
        $scope.showSubject = !$scope.showSubject;
    };

    $scope.init();

}