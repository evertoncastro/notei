/**
 * Created by everton on 04/07/15.
 */

angular.module('anotei').controller('HomeworkCtrl', HomeworkCtrl);

function HomeworkCtrl($scope, $ionicLoading, serviceHomework, serviceSubject, serviceValidation,
                  serviceConstants, $cordovaDialogs, $rootScope, $state, serviceDatePicker){

    $scope.showHomework = false;
    $scope.homework_id = null;
    $scope.sort = serviceHomework.getCurrentSortHomework();
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.data = {};

    $rootScope.$on('serviceHomework:manipulatedHomework', function() {
        $scope.init();
    });

    $scope.init = function(){
        $ionicLoading.show();
        var resp = serviceHomework.getHomeworks($scope.sort);
        resp.then(function(list){
            $scope.data.homeworkList = list;
            serviceHomework.setCurrentHomeworkList(list);
            $ionicLoading.hide();
            $scope.showHomework = false;
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
                    $scope.data.homeworkList[index].data_entrega = date;
                    var homework = $scope.data.homeworkList[index];
                    $scope.updateHomework(homework);
                }
            );
        }
    };


    $scope.deleteHomework = function(data){
        $cordovaDialogs.confirm(serviceConstants.MSG_CONFIRM_DELETE_HOMEWORK.MSG+'"'+data.trabalho+'"?',
            serviceConstants.MSG_CONFIRM_DELETE_HOMEWORK.ALERT,
            [serviceConstants.MSG_CONFIRM_DELETE_HOMEWORK.BUTTON_OK,
                serviceConstants.MSG_CONFIRM_DELETE_HOMEWORK.BUTTON_CANCEL]).then(
            function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                if(buttonIndex == 1){
                    serviceHomework.deleteHomework(data.id).then(
                        function(){
                            $cordovaDialogs.alert(
                                serviceConstants.MSG_SUCCESS_DELETE_HOMEWORK.MSG,
                                serviceConstants.MSG_SUCCESS_DELETE_HOMEWORK.ALERT,
                                serviceConstants.MSG_SUCCESS_DELETE_HOMEWORK.BUTTON);
                            $rootScope.$broadcast('serviceHomework:manipulatedHomework');
                        },
                        function(){
                            $cordovaDialogs.alert(
                                serviceConstants.MSG_FAIL_DELETE_HOMEWORK.MSG,
                                serviceConstants.MSG_FAIL_DELETE_HOMEWORK.ALERT,
                                serviceConstants.MSG_FAIL_DELETE_HOMEWORK.BUTTON);
                        }
                    )
                }
            });
    };

    //TODO: test
    $scope.goToNewHomework = function(){
        serviceHomework.verifySubjectExistence($scope.data.subjectList);
    };


    //TODO: test
    $scope.updateHomework = function(data, input){
        var oldValue = $scope.oldValue;
        var obj = {};
        if(input == 'peso'){
            obj = {newValue: data.peso, oldValue: oldValue};
            data.peso = serviceValidation.validateInputNotes(obj);
        }else if(input == 'nota'){
            obj = {newValue: data.nota, oldValue: oldValue};
            data.nota = serviceValidation.validateInputNotes(obj);
        }
        serviceHomework.updateHomework(data);
    };

    $scope.setOldValue = function(value){
        $scope.oldValue = value;
    };

    $scope.updateFullHomework = function(data){
        serviceHomework.setCurrentHomework(data);
        $state.go('app.homework-new');
    };

    $scope.sortHomeworkList = function(sort){

        $ionicLoading.show();
        var resp = serviceHomework.getHomeworks(sort);
        resp.then(function(list){
            $scope.data.homeworkList = list;
            $scope.sort = sort;
            serviceHomework.setCurrentSortHomework(sort);
            $ionicLoading.hide();
        });
    };

    $scope.openHomework = function(id){
        $scope.homework_id = id;
        $scope.showHomework = !$scope.showHomework;
        if($scope.showHomework==true){
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

    $scope.sortHomeworkList = function(sort){

        $ionicLoading.show();
        var resp = serviceHomework.getHomeworks(sort);
        resp.then(function(list){
            $scope.data.homeworkList = list;
            $scope.sort = sort;
            serviceHomework.setCurrentSortHomework(sort);
            $ionicLoading.hide();
        });
    };


    $scope.init();

}
