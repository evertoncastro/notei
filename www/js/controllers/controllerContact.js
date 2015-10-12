/**
 * Created by everton on 04/07/15.
 */
angular.module('anotei').controller('ContactCtrl', ContactCtrl);

function ContactCtrl($scope, serviceContact){

    $scope.sendEmail = function(type){
        serviceContact.sendEmail(type);
    };

}