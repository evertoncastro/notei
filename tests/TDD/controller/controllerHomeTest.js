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

    it('Should verify if the function init loads the notes settings and ' +
        'define it using getter in service settings' ,function(){

        spyOn(serviceConfig, 'getConfigNotes').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {
                        id: 1,
                        intervalo_de: 0,
                        intervalo_para: 10,
                        media_minima: 7
                    };
                    return callback(result);
                }
            }
        });

        spyOn(serviceConfig, 'setObjNotes');

        expect(HomeCtrl).toBeDefined();
        HomeCtrl();
        $scope.$apply();

        expect(serviceConfig.getConfigNotes).toHaveBeenCalled();
        expect(serviceConfig.setObjNotes).toHaveBeenCalledWith({
            id: 1,
            intervalo_de: 0,
            intervalo_para: 10,
            media_minima: 7
        });
    });

});


