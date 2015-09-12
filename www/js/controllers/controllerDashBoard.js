/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('DashBoardCtrl', DashBoardCtrl);

function DashBoardCtrl($scope, $ionicModal, serviceSubject, $ionicLoading,
                       serviceDashBoard, serviceConfig, $cordovaDialogs,
                       serviceConstants){
    $scope.data = {};
    $scope.sort = serviceSubject.getCurrentSortSubject();

    $scope.init = function(){
        $ionicLoading.show();
        var resp = serviceSubject.getSubjects($scope.sort);
        resp.then(function(list){
            $scope.data.subjectList = list;
            $ionicLoading.hide();
            $scope.showSubject = false;
        });
    };

    $scope.loadActivities = function(subject){
        serviceDashBoard.mountList(subject.id).then(
            function(result){
                $scope.data.listActivities = result;
                $scope.data.subject = subject;
                $scope.data.average = serviceDashBoard.calcAverage(result);
                $scope.statusAverage();
                $scope.statusAttendance();
                $scope.openModal();
            }
        )
    };

    $scope.statusAverage = function(){
        var configNotes = serviceConfig.getObjNotes();
        if($scope.data.average>=configNotes.media_minima){
            $scope.data.statusAverage = true;
        }else{
            $scope.data.statusAverage = false;
        }
    };

    $scope.statusAttendance = function(){
        var subject = $scope.data.subject;
        var percent = subject.num_faltas/subject.max_faltas;
        if(percent>=0.75){
            $scope.data.statusAttendance = true;
        }else{
            $scope.data.statusAttendance = false;
        }
    };

    $scope.changeShowActivity = function(activity){
        serviceDashBoard.changeShowActivity(activity);
        var list = $scope.data.listActivities;
        $scope.data.average = serviceDashBoard.calcAverage(list);
        $scope.statusAverage();
    };

    $scope.refreshAverage = function(){
        var list = $scope.data.listActivities;
        $scope.data.average = serviceDashBoard.calcAverage(list);
        $scope.statusAverage();
    };

    $scope.sortSubjectList = function(sort){
        $ionicLoading.show();
        var resp = serviceSubject.getSubjects(sort);
        resp.then(function(list){
            $scope.data.subjectList = list;
            $scope.sort = sort;
            serviceSubject.setCurrentSortSubject(sort);
            $ionicLoading.hide();
        });
    };

    $scope.finishDashBoard = function(){
        serviceDashBoard.multipleUpdate($scope.data.listActivities).then(
            function(){
                $scope.closeModal();
            }
        );
    };

    $ionicModal.fromTemplateUrl('templates/modal/modal-subject.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        //$scope.finishDashBoard();
        // Execute action
        //serviceDashBoard.multipleUpdate($scope.data.listActivities);
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        //$scope.finishDashBoard();
        // Execute action
    });

    $scope.init();


}