/**
 * Created by everton on 04/07/15.
 */
angular.module('starter').controller('DashBoardCtrl', DashBoardCtrl);

function DashBoardCtrl($scope, $ionicModal){

    $scope.showSubject = false;
    $scope.showLeftTab = true;
    $scope.showRightTab = false;
    $scope.init = function(){

    };

    $scope.openSubject = function(){
      $scope.showSubject = !$scope.showSubject;
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