/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('ExamCtrl', ExamCtrl);

function ExamCtrl($scope, $ionicLoading, serviceExam, serviceSubject,
                  serviceConstants, $cordovaDialogs, $rootScope, $state){

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
            $ionicLoading.hide();
            $scope.showExam = false;
        });
    };

    $scope.deleteExam = function(data){
        $cordovaDialogs.confirm(serviceConstants.MSG_CONFIRM_DELETE_EXAM.MSG+' "'+data.nome+'"?',
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

    $scope.updateExam = function(data){
        $ionicLoading.show();
        serviceExam.updateExam(data);
        $ionicLoading.hide();
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
        console.log('Left');
    };

    $scope.openRightTab = function(){
        $scope.showRightTab = !$scope.showRightTab;
        $scope.showLeftTab = !$scope.showLeftTab;
        console.log('Right');
    };

    $scope.setData = function(data){
       $scope.dataString = data.toString();
       $scope.dataOut = '2016-05-10';
    };


    $scope.init();

}