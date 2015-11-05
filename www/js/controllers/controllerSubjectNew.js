/**
 * Created by everton on 05/08/15.
 */
angular.module('anotei').controller('SubjectNewCtrl', SubjectNewCtrl);

function SubjectNewCtrl($scope, $state, $ionicLoading, serviceSubject, $rootScope, serviceGA,
                        serviceConstants, $cordovaDialogs, serviceUtil, serviceValidation){
    $scope.title = null;
    $scope.wayForm = null;
    $scope.data = {};

    $scope.manipulateSubject = function(data, wayForm){
        function validate(data){
            var validator = null;
            if(serviceUtil.isEmpty(data.nome)){validator='Nome'}
            else if(serviceUtil.isEmpty(data.max_faltas)){validator='Número máximo de faltas'}
            else if(serviceUtil.isEmpty(data.professor)){validator='Professor'}

            return validator;
        }
        var validator = validate(data);
        if(validator != null){
            $cordovaDialogs.alert(serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.MSG+'"'+validator+'"',
                                  serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.ALERT,
                                  serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.BUTTON);
        }else{
            var duplicatedSubjectName = serviceSubject.validDuplicatedSubject($scope.subjectList, data.nome);
            if(duplicatedSubjectName && $scope.wayForm == 'add'){
                $cordovaDialogs.alert(serviceConstants.MSG_DUPLICATED_SUBJECT_NAME.MSG + data.nome,
                                      serviceConstants.MSG_DUPLICATED_SUBJECT_NAME.ALERT,
                                      serviceConstants.MSG_DUPLICATED_SUBJECT_NAME.BUTTON);
            }else{
                $ionicLoading.show();
                if(wayForm == 'add'){
                    serviceSubject.insertSubject(data).then(
                        function(valueExecution){
                            if(valueExecution==1){
                                $cordovaDialogs.alert(serviceConstants.MSG_DATA_INVALID_SUBJECT_NEW.MSG,
                                    serviceConstants.MSG_DATA_INVALID_SUBJECT_NEW.ALERT,
                                    serviceConstants.MSG_DATA_INVALID_SUBJECT_NEW.BUTTON);
                                $ionicLoading.hide();
                            }else if(valueExecution==2){
                                $ionicLoading.hide();
                                $cordovaDialogs.alert(serviceConstants.MSG_SUCCESS_SUBJECT_NEW.MSG,
                                    serviceConstants.MSG_SUCCESS_SUBJECT_NEW.ALERT,
                                    serviceConstants.MSG_SUCCESS_SUBJECT_NEW.BUTTON);

                                $rootScope.$broadcast('serviceSubject:manipulatedSubject');
                                $state.go('app.subjects');
                            }
                        },
                        function(){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_FAIL_SUBJECT_NEW.MSG,
                                serviceConstants.MSG_FAIL_SUBJECT_NEW.ALERT,
                                serviceConstants.MSG_FAIL_SUBJECT_NEW.BUTTON);
                        }
                    )
                }else if(wayForm == 'edit'){
                    serviceSubject.updateSubject(data).then(
                        function(){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_UPDATE_TITLE_SUBJECT.MSG,
                                serviceConstants.MSG_UPDATE_TITLE_SUBJECT.ALERT,
                                serviceConstants.MSG_UPDATE_TITLE_SUBJECT.BUTTON);

                            $rootScope.$broadcast('serviceSubject:manipulatedSubject');
                            $state.go('app.subjects');
                        },
                        function(){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_FAIL_SUBJECT_NEW.MSG,
                                serviceConstants.MSG_FAIL_SUBJECT_NEW.ALERT,
                                serviceConstants.MSG_FAIL_SUBJECT_NEW.BUTTON);
                        }
                    )
                }
            }
        }
    };

    $scope.loadForm = function(){
        var respSubject = serviceSubject.getSubjects('asc');
        respSubject.then(function(list){
            $scope.subjectList = list;
        });
        var data = serviceSubject.getCurrentSubject();
        if(!data){
           $scope.title = 'Nova Matéria';
            $scope.wayForm = 'add';
        }else if(data){
            $scope.title = 'Editar Matéria';
            $scope.wayForm = 'edit';
            $scope.data = data;
            serviceSubject.setCurrentSubject(null);
        }

        //TODO: tests
        serviceGA.gaTrackerView('Subject_New view accessed');
    };

    $scope.setOldValue = function(value){
        $scope.oldValue = value;
    };

    $scope.validateInputAttendance = function(value){
        var obj = {};
        var oldValue = $scope.oldValue;
        var upData = null;
        obj = {newValue: value, oldValue: oldValue};
        upData = serviceValidation.validateInputAttendance(obj);
        $scope.data.max_faltas = upData;
    };

    $scope.loadForm();
}