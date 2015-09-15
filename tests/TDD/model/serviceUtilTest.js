/**
 * Created by everton on 7/09/15.
 */
describe('Service Util Test', function(){
    var serviceUtil, $scope, serviceConfig, $cordovaDialogs, serviceConstants;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceUtil = $injector.get('serviceUtil');
        serviceConfig = $injector.get('serviceConfig');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceConstants = $injector.get('serviceConstants');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));
});