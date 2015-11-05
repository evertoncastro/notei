/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('SubjectCtrl', SubjectCtrl);

    function SubjectCtrl($scope, serviceSubject, $rootScope, serviceConstants, serviceGA,
                         $ionicLoading, $state, $cordovaDialogs, serviceValidation){

        $scope.showSubject = false;
        $scope.subject_id = null;
        $scope.sort = serviceSubject.getCurrentSortSubject();
        $scope.data = {};

        $rootScope.$on('serviceSubject:manipulatedSubject', function() {
            $scope.init();
        });

        $scope.init = function(){
            $ionicLoading.show();
            var resp = serviceSubject.getSubjects($scope.sort);
            resp.then(function(list){
                $scope.data.subjectList = list;
                $ionicLoading.hide();
            });

            //TODO: tests
            serviceGA.gaTrackerView('Subject view accessed');
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

        $scope.deleteSubject = function(data){
            $cordovaDialogs.confirm(serviceConstants.MSG_CONFIRM_DELETE_SUBJECT.MSG+' "'+data.nome+'"?',
            serviceConstants.MSG_CONFIRM_DELETE_SUBJECT.ALERT,
            [serviceConstants.MSG_CONFIRM_DELETE_SUBJECT.BUTTON_OK,
            serviceConstants.MSG_CONFIRM_DELETE_SUBJECT.BUTTON_CANCEL]).then(
                function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                if(buttonIndex == 1){
                    serviceSubject.deleteSubject(data.id).then(
                        function(){
                            $cordovaDialogs.alert(
                                serviceConstants.MSG_SUCCESS_DELETE_SUBJECT.MSG,
                                serviceConstants.MSG_SUCCESS_DELETE_SUBJECT.ALERT,
                                serviceConstants.MSG_SUCCESS_DELETE_SUBJECT.BUTTON);
                            $rootScope.$broadcast('serviceSubject:manipulatedSubject');
                            //$state.go('app.subjects');
                        },
                        function(){
                            $cordovaDialogs.alert(
                                serviceConstants.MSG_FAIL_DELETE_SUBJECT.MSG,
                                serviceConstants.MSG_FAIL_DELETE_SUBJECT.ALERT,
                                serviceConstants.MSG_FAIL_DELETE_SUBJECT.BUTTON);
                        }
                    )
                }
            });
        };

        $scope.openSubject = function(id){
            $scope.subject_id = id;
            $scope.showSubject = !$scope.showSubject;
        };

        $scope.sortSubjectList = function(sort){

            $ionicLoading.show();
            var resp = serviceSubject.getSubjects(sort);
            resp.then(function(list){
                $scope.data.subjectList = list;
                $scope.sort = sort;
                serviceSubject.setCurrentSortSubject(sort);
                $ionicLoading.hide();
            });
        };

        $scope.setOldValue = function(value){
            $scope.oldValue = value;
        };

        $scope.validateInputAttendance = function(dataSubject, index, type){
            var obj = {};
            var oldValue = $scope.oldValue;
            var upData = null;
            var upSubject = {};
            if(type=='max_faltas'){
                obj = {newValue: dataSubject.max_faltas, oldValue: oldValue};
                upData = serviceValidation.validateInputAttendance(obj);
                $scope.data.subjectList[index].max_faltas = upData;
                if(serviceValidation.getStatusValidation()==true){
                    upSubject = $scope.data.subjectList[index];
                    $scope.updateSubject(upSubject);
                }
            }else if(type=='num_faltas'){
                obj = {newValue: dataSubject.num_faltas, oldValue: oldValue};
                upData = serviceValidation.validateInputAttendance(obj);
                $scope.data.subjectList[index].num_faltas = upData;
                if(serviceValidation.getStatusValidation()==true){
                    upSubject = $scope.data.subjectList[index];
                    $scope.updateSubject(upSubject);
                }
            }
        };

        $scope.init();

    }