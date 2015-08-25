/**
 * Created by everton on 22/08/15.
 */
angular.module('anotei').controller('ExamNewCtrl', ExamNewCtrl);

function ExamNewCtrl($scope, $state, $ionicLoading, serviceExam, serviceSubject,
                     $rootScope, serviceConstants, $cordovaDialogs, serviceUtil){
    $scope.title = null;
    $scope.wayForm = null;
    $scope.data = {};
    $scope.currentExamList = null;

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
            if(wayForm == 'add'){
                var noDuplicatedAddExam = serviceExam.validDuplicatedAddExam($scope.currentExamList, data.id_materia, data.titulo);
                if(noDuplicatedAddExam) {
                    $cordovaDialogs.alert(serviceConstants.MSG_DUPLICATE_EXAM.MSG + '"' + data.titulo + '"' + ' para esta matéria!',
                        serviceConstants.MSG_DUPLICATE_EXAM.ALERT,
                        serviceConstants.MSG_DUPLICATE_EXAM.BUTTON);
                }else if(!noDuplicatedAddExam){
                    $ionicLoading.show();
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
                }
            }else if(wayForm == 'edit'){
                var noDuplicatedEditExam = serviceExam.validDuplicatedEditExam($scope.currentExamList, data.id_materia, data.titulo, data.id);
                if(noDuplicatedEditExam) {
                    $cordovaDialogs.alert(serviceConstants.MSG_DUPLICATE_EXAM.MSG + '"' + data.titulo + '"' + ' para esta matéria!',
                        serviceConstants.MSG_DUPLICATE_EXAM.ALERT,
                        serviceConstants.MSG_DUPLICATE_EXAM.BUTTON);
                }else if(!noDuplicatedEditExam){
                    $ionicLoading.show();
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
        }
    };

    $scope.loadForm = function(){
        var respSubject = serviceSubject.getSubjects('asc');
        respSubject.then(function(list){
            $scope.subjectList = list;
        });
        $scope.currentExamList  = serviceExam.getCurrentExamList();
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