/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SubjectCtrl', SubjectCtrl);

    function SubjectCtrl($scope, serviceSubject, $rootScope,
                         $ionicLoading, $state){

        $scope.showSubject = false;
        $scope.subject_id = null;
        $scope.data = {};

        $rootScope.$on('serviceSubject:manipulatedSubject', function() {
            $scope.init();
        });

        $scope.init = function(){
            $ionicLoading.show();
            var resp = serviceSubject.getSubjects();
            resp.then(function(list){
                $scope.data.subjectList = list;
                $ionicLoading.hide();
                $scope.showSubject = false;
            });
        };

        $scope.updateSubject = function(data){
            $ionicLoading.show();
            serviceSubject.updateSubject(data);
            $ionicLoading.hide();
        };

        $scope.updateFullSubject = function(data){
            serviceSubject.setCurrentSubject(data);
            $state.go('app.subject-new');
        };

        $scope.openSubject = function(id){
            $scope.subject_id = id;
            $scope.showSubject = !$scope.showSubject;
        };

        $scope.init();

    }