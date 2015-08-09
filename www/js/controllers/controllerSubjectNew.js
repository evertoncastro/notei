/**
 * Created by everton on 05/08/15.
 */
angular.module('anotei').controller('SubjectNewCtrl', SubjectNewCtrl);

function SubjectNewCtrl($scope, $state, $ionicLoading, serviceSubject, $rootScope,
                        serviceConstants, $cordovaDialogs, serviceUtil){

    //$scope.init = function

    $scope.insertSubject = function(data){
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
            $ionicLoading.show();

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

                        $rootScope.$broadcast('serviceSubject:insertedSubject');
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
        }

    }

}