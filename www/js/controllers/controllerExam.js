/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('ExamCtrl', ExamCtrl);

function ExamCtrl($scope, $ionicLoading, serviceExam, serviceSubject, serviceDatePicker,
                  serviceConstants, $cordovaDialogs, $rootScope, $state, serviceValidation){

    $scope.showExam = false;
    $scope.exam_id = null;
    $scope.sort = serviceExam.getCurrentSortExam();
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.data = {};

    $rootScope.$on('serviceExam:manipulatedExam', function() {
        $scope.init();
    });

    $scope.init = function(){
        $ionicLoading.show();
        var resp = serviceExam.getExams($scope.sort);
        resp.then(function(list){
            $scope.data.examList = list;
            serviceExam.setCurrentExamList(list);
            $ionicLoading.hide();
            $scope.showExam = false;
        });
        serviceSubject.getSubjects($scope.sort).then(
            function(list){
            $scope.data.subjectList = list;
            $ionicLoading.hide();
        });
    };

    if(window.cordova){
        $scope.disableInput = true;
    }else{
        $scope.disableInput = false;
    }
    //TODO: TDD & BDD
    $scope.inputByDatePicker = function(index){
        if($scope.disableInput){
            serviceDatePicker.inputByDatePicker().then(
                function(date){
                    $scope.data.examList[index].data = date;
                    var exam = $scope.data.examList[index];
                    $scope.updateExam(exam);
                }
            );
        }
    };

    $scope.deleteExam = function(data){
        $cordovaDialogs.confirm(serviceConstants.MSG_CONFIRM_DELETE_EXAM.MSG+data.titulo+' "'+data.nome+'"?',
            serviceConstants.MSG_CONFIRM_DELETE_EXAM.ALERT,
            [serviceConstants.MSG_CONFIRM_DELETE_EXAM.BUTTON_OK,
                serviceConstants.MSG_CONFIRM_DELETE_EXAM.BUTTON_CANCEL]).then(
            function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                if(buttonIndex == 1){
                    serviceExam.deleteExam(data.id).then(
                        function(){
                            $cordovaDialogs.alert(
                                serviceConstants.MSG_SUCCESS_DELETE_EXAM.MSG,
                                serviceConstants.MSG_SUCCESS_DELETE_EXAM.ALERT,
                                serviceConstants.MSG_SUCCESS_DELETE_EXAM.BUTTON);
                            $rootScope.$broadcast('serviceExam:manipulatedExam');
                        },
                        function(){
                            $cordovaDialogs.alert(
                                serviceConstants.MSG_FAIL_DELETE_EXAM.MSG,
                                serviceConstants.MSG_FAIL_DELETE_EXAM.ALERT,
                                serviceConstants.MSG_FAIL_DELETE_EXAM.BUTTON);
                        }
                    )
                }
            });
    };

    //TODO: test
    $scope.goToNewExam = function(){
        serviceExam.verifySubjectExistence($scope.data.subjectList);
    };

    //TODO: test
    $scope.updateExam = function(data, value){
        var oldValue = $scope.oldValue;
        var obj = {};
        if(value == 'peso'){
            obj = {newValue: data.peso, oldValue: oldValue};
            data.peso = serviceValidation.validateInputNotes(obj);
        }else if(value == 'nota'){
            obj = {newValue: data.nota, oldValue: oldValue};
            data.nota = serviceValidation.validateInputNotes(obj);
        }
        serviceExam.updateExam(data);
    };

    $scope.setOldValue = function(value){
        $scope.oldValue = value;
    };

    $scope.updateFullExam = function(data){
        serviceExam.setCurrentExam(data);
        $state.go('app.exam-new');
    };

    $scope.sortExamList = function(sort){

        $ionicLoading.show();
        var resp = serviceExam.getExams(sort);
        resp.then(function(list){
            $scope.data.examList = list;
            $scope.sort = sort;
            serviceExam.setCurrentSortExam(sort);
            $ionicLoading.hide();
        });
    };

    $scope.openExam = function(id){
        $scope.exam_id = id;
        $scope.showExam = !$scope.showExam;
        if($scope.showExam==true){
            $scope.showLeftTab = true;
            $scope.showRightTab = false;
        }
    };

    $scope.openLeftTab = function(){
        $scope.showLeftTab = !$scope.showLeftTab;
        $scope.showRightTab = !$scope.showRightTab;
    };

    $scope.openRightTab = function(){
        $scope.showRightTab = !$scope.showRightTab;
        $scope.showLeftTab = !$scope.showLeftTab;
    };

    $scope.setData = function(data){
       $scope.dataString = data.toString();
       $scope.dataOut = '2016-05-10';
    };

    $scope.sortExamList = function(sort){

        $ionicLoading.show();
        var resp = serviceExam.getExams(sort);
        resp.then(function(list){
            $scope.data.examList = list;
            $scope.sort = sort;
            serviceExam.setCurrentSortExam(sort);
            $ionicLoading.hide();
        });
    };

    $scope.init();

}