/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('DashBoardCtrl', DashBoardCtrl);

function DashBoardCtrl($scope, $ionicModal, serviceSubject, $ionicLoading,
                       serviceDashBoard){
    $scope.data = {};

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
                $scope.openModal();
            }
        )
    };

    $scope.changeShowActivity = function(){
        var list = $scope.data.listActivities;
        $scope.data.average = serviceDashBoard.calcAverage(list);
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
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.init();


}