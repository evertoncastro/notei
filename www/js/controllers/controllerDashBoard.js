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

    $scope.loadActivities = function(id_materia){
        serviceDashBoard.mountList(id_materia).then(
            function(result){
                $scope.data.listActivities = result;
            }
        )
    };

    $ionicModal.fromTemplateUrl('templates/modal/modal-subject.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(id_materia) {
        $scope.loadActivities(id_materia);
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