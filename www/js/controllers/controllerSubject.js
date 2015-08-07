/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SubjectCtrl', SubjectCtrl);

    function SubjectCtrl($scope, serviceSubject, $rootScope){

        $scope.showSubject = false;
        $scope.subject_id = null;
        $scope.data = {};

        $rootScope.$on('serviceSubject:insertedSubject', function() {
            // call init....
            $scope.init();
        });

        $scope.init = function(){
            var resp = serviceSubject.getSubjects();
            resp.then(function(list){
                $scope.data.subjectList = list;
            });
        };

        $scope.openSubject = function(id){
            $scope.subject_id = id;
            $scope.showSubject = !$scope.showSubject;
        };

        $scope.init();

    }