/**
 * Created by everton on 06/08/15.
 */
describe('Home loading', function () {

    var HomeCtrl, $scope, serviceConfig;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceConfig = $injector.get('serviceConfig');

        $httpBackend.whenGET(/templates\/.*/).respond(200);

        HomeCtrl = function(){
            return $controller('HomeCtrl', {'$scope': $scope});
        };
    }));
});


