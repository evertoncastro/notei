/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('ContactCtrl', ContactCtrl);

function ContactCtrl($scope, serviceContact, serviceGA){

    //TODO: tests
    serviceGA.gaTrackerView('Contact view accessed');

    $scope.sendEmail = function(type){
        serviceContact.sendEmail(type);
    };

}