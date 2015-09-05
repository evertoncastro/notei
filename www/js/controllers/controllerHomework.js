/**
 * Created by everton on 04/07/15.
 */

angular.module('anotei').controller('HomeworkCtrl', HomeworkCtrl);

function HomeworkCtrl($scope, $ionicLoading, serviceHomework, serviceSubject,
                  serviceConstants, $cordovaDialogs, $rootScope, $state){

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

    $scope.updateHomework = function(data){
        $ionicLoading.show();
        serviceHomework.updateHomework(data);
        $ionicLoading.hide();
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

    /* $scope.reLoadPage = function(){
     $rootScope.$broadcast('serviceHomework:manipulatedHomework');
     };*/

    $scope.init();

}

/*
angular.module('anotei').controller('HomeworkCtrl', HomeworkCtrl);

function HomeworkCtrl($scope){

    $scope.showHomework = false;
    $scope.showLeftTab = true;
    $scope.showRightTab = false;



    $scope.openHomework = function(){
      $scope.showHomework = !$scope.showHomework;
    };

    $scope.openLeftTab = function(){
        $scope.showLeftTab = !$scope.showLeftTab;
        $scope.showRightTab = !$scope.showRightTab;
        console.log('Left');
    };

    $scope.openRightTab = function(){
        $scope.showRightTab = !$scope.showRightTab;
        $scope.showLeftTab = !$scope.showLeftTab;
        console.log('Right');
    };


    $scope.init();

}*/
