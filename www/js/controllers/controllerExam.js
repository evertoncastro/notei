/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('ExamCtrl', ExamCtrl);

function ExamCtrl($scope, $ionicLoading, serviceExam, serviceSubject){

    $scope.showExam = false;
    $scope.exam_id = null;
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.data = {};

    $scope.init = function(){
        $ionicLoading.show();
        var resp = serviceExam.getExams($scope.sort);
        resp.then(function(list){
            $scope.data.examList = list;
            $ionicLoading.hide();
            $scope.showExam = false;
        });
        var respSubject = serviceSubject.getSubjects('asc');
        respSubject.then(function(list){
            $scope.data.subjectList = list;
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