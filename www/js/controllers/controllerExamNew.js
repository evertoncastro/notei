/**
 * Created by everton on 22/08/15.
 */
angular.module('anotei').controller('ExamNewCtrl', ExamNewCtrl);

function ExamNewCtrl($scope, $state, $ionicLoading, serviceExam, serviceSubject,
                     $rootScope, serviceConstants, $cordovaDialogs, serviceUtil){
    $scope.title = null;
    $scope.wayForm = null;
    $scope.data = {};

    $scope.manipulateExam = function(data, wayForm){
        function validate(data){
            var validator = null;
            if(serviceUtil.isEmpty(data.titulo)){validator='Título'}
            else if(serviceUtil.isEmpty(data.id_materia)){validator='Matéria'}
            else if(serviceUtil.isEmpty(data.data)){validator='data'}

            return validator;
        }
        var validator = validate(data);
        if(validator != null){
            $cordovaDialogs.alert(serviceConstants.MSG_INCOMPLETE_EXAM_NEW.MSG+'"'+validator+'"',
                                  serviceConstants.MSG_INCOMPLETE_EXAM_NEW.ALERT,
                                  serviceConstants.MSG_INCOMPLETE_EXAM_NEW.BUTTON);
        }else{
            $ionicLoading.show();
            if(wayForm == 'add'){
                serviceExam.insertExam(data).then(
                    function(valueExecution){
                        if(valueExecution==1){
                            $cordovaDialogs.alert(serviceConstants.MSG_DATA_INVALID_EXAM_NEW.MSG,
                                serviceConstants.MSG_DATA_INVALID_EXAM_NEW.ALERT,
                                serviceConstants.MSG_DATA_INVALID_EXAM_NEW.BUTTON);
                            $ionicLoading.hide();
                        }else if(valueExecution==2){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_SUCCESS_EXAM_NEW.MSG,
                                serviceConstants.MSG_SUCCESS_EXAM_NEW.ALERT,
                                serviceConstants.MSG_SUCCESS_EXAM_NEW.BUTTON);

                            $rootScope.$broadcast('serviceExam:manipulatedExam');
                            $state.go('app.exam');
                        }
                    },
                    function(){
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(serviceConstants.MSG_FAIL_EXAM_NEW.MSG,
                            serviceConstants.MSG_FAIL_EXAM_NEW.ALERT,
                            serviceConstants.MSG_FAIL_EXAM_NEW.BUTTON);
                    }
                )
            }else if(wayForm == 'edit'){
                serviceExam.updateExam(data).then(
                    function(){
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(serviceConstants.MSG_UPDATE_TITLE_EXAM.MSG,
                            serviceConstants.MSG_UPDATE_TITLE_EXAM.ALERT,
                            serviceConstants.MSG_UPDATE_TITLE_EXAM.BUTTON);

                        $rootScope.$broadcast('serviceExam:manipulatedExam');
                        $state.go('app.exam');
                    },
                    function(){
                        $ionicLoading.hide();
                        $cordovaDialogs.alert(serviceConstants.MSG_FAIL_EXAM_NEW.MSG,
                            serviceConstants.MSG_FAIL_EXAM_NEW.ALERT,
                            serviceConstants.MSG_FAIL_EXAM_NEW.BUTTON);
                    }
                )
            }
        }
    };

    $scope.loadForm = function(){
        var respSubject = serviceSubject.getSubjects('asc');
        respSubject.then(function(list){
            $scope.subjectList = list;
        });
        var data = serviceExam.getCurrentExam();
        if(!data){
           $scope.title = 'Nova Prova';
            $scope.wayForm = 'add';
        }else if(data){
            $scope.title = 'Editar Prova';
            $scope.wayForm = 'edit';
            $scope.data = data;
            serviceExam.setCurrentExam(null);
        }
    };

    $scope.loadForm();
}