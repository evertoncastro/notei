/**
 * Created by everton on 22/08/15.
 */
angular.module('anotei').controller('HomeworkNewCtrl', HomeworkNewCtrl);

function HomeworkNewCtrl($scope, $state, $ionicLoading, serviceHomework, serviceSubject,
                     $rootScope, serviceConstants, $cordovaDialogs, serviceUtil){
    $scope.title = null;
    $scope.wayForm = null;
    $scope.data = {};
    $scope.currentHomeworkList = null;

    $scope.manipulateHomework = function(data, wayForm){
        function validate(data){
            var validator = null;
            if(serviceUtil.isEmpty(data.trabalho)){validator='Trabalho'}
            else if(serviceUtil.isEmpty(data.id_materia)){validator='Matéria'}
            else if(serviceUtil.isEmpty(data.data_entrega)){validator='Data de entrega'}

            return validator;
        }
        var validator = validate(data);
        if(validator != null){
            $cordovaDialogs.alert(serviceConstants.MSG_INCOMPLETE_HOMEWORK_NEW.MSG+'"'+validator+'"',
                                  serviceConstants.MSG_INCOMPLETE_HOMEWORK_NEW.ALERT,
                                  serviceConstants.MSG_INCOMPLETE_HOMEWORK_NEW.BUTTON);
        }else{
            if(wayForm == 'add'){
                var noDuplicatedAddHomework = serviceHomework.validDuplicatedAddHomework($scope.currentHomeworkList, data.id_materia, data.trabalho);
                if(noDuplicatedAddHomework) {
                    $cordovaDialogs.alert(serviceConstants.MSG_DUPLICATE_HOMEWORK.MSG + '"' + data.trabalho + '"',
                        serviceConstants.MSG_DUPLICATE_HOMEWORK.ALERT,
                        serviceConstants.MSG_DUPLICATE_HOMEWORK.BUTTON);
                }else if(!noDuplicatedAddHomework){
                    $ionicLoading.show();
                    serviceHomework.insertHomework(data).then(
                        function(valueExecution){
                            if(valueExecution==1){
                                $cordovaDialogs.alert(serviceConstants.MSG_DATA_INVALID_HOMEWORK_NEW.MSG,
                                    serviceConstants.MSG_DATA_INVALID_HOMEWORK_NEW.ALERT,
                                    serviceConstants.MSG_DATA_INVALID_HOMEWORK_NEW.BUTTON);
                                $ionicLoading.hide();
                            }else if(valueExecution==2){
                                $ionicLoading.hide();
                                $cordovaDialogs.alert(serviceConstants.MSG_SUCCESS_HOMEWORK_NEW.MSG,
                                    serviceConstants.MSG_SUCCESS_HOMEWORK_NEW.ALERT,
                                    serviceConstants.MSG_SUCCESS_HOMEWORK_NEW.BUTTON);

                                $rootScope.$broadcast('serviceHomework:manipulatedHomework');
                                $state.go('app.homework');
                            }
                        },
                        function(){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_FAIL_HOMEWORK_NEW.MSG,
                                serviceConstants.MSG_FAIL_HOMEWORK_NEW.ALERT,
                                serviceConstants.MSG_FAIL_HOMEWORK_NEW.BUTTON);
                        }
                    )
                }
            }else if(wayForm == 'edit'){
                var noDuplicatedEditHomework = serviceHomework.validDuplicatedEditHomework($scope.currentHomeworkList, data.id_materia, data.trabalho, data.id);
                if(noDuplicatedEditHomework) {
                    $cordovaDialogs.alert(serviceConstants.MSG_DUPLICATE_HOMEWORK.MSG + '"' + data.trabalho + '"' + ' para esta matéria!',
                        serviceConstants.MSG_DUPLICATE_HOMEWORK.ALERT,
                        serviceConstants.MSG_DUPLICATE_HOMEWORK.BUTTON);
                }else if(!noDuplicatedEditHomework){
                    $ionicLoading.show();
                    serviceHomework.updateHomework(data).then(
                        function(){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_UPDATE_TITLE_HOMEWORK.MSG,
                                serviceConstants.MSG_UPDATE_TITLE_HOMEWORK.ALERT,
                                serviceConstants.MSG_UPDATE_TITLE_HOMEWORK.BUTTON);

                            $rootScope.$broadcast('serviceHomework:manipulatedHomework');
                            $state.go('app.homework');
                        },
                        function(){
                            $ionicLoading.hide();
                            $cordovaDialogs.alert(serviceConstants.MSG_FAIL_HOMEWORK_NEW.MSG,
                                serviceConstants.MSG_FAIL_HOMEWORK_NEW.ALERT,
                                serviceConstants.MSG_FAIL_HOMEWORK_NEW.BUTTON);
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
        $scope.currentHomeworkList  = serviceHomework.getCurrentHomeworkList();
        var data = serviceHomework.getCurrentHomework();
        if(!data){
           $scope.title = 'Novo Trabalho';
            $scope.wayForm = 'add';
        }else if(data){
            $scope.title = 'Editar Trabalho';
            $scope.wayForm = 'edit';
            $scope.data = data;
            serviceHomework.setCurrentHomework(null);
        }
    };

    $scope.loadForm();
}