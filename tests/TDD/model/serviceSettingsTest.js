/**
 * Created by everton on 05/09/15.
 */
describe('Service Exam Test', function() {
    var $scope, serviceConfig, factoryDatabase, $cordovaDialogs,
        serviceConstants;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $httpBackend) {
        var rootScope = $injector.get('$rootScope');
        serviceConfig = $injector.get('serviceConfig');
        factoryDatabase = $injector.get('factoryDatabase');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceConstants = $injector.get('serviceConstants');
        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

        spyOn($cordovaDialogs, 'alert');

    }));

    it('TDD - Should define all methods', function(){
        expect(serviceConfig.getConfigNotes).toBeDefined();
        expect(serviceConfig.updateConfigNotes).toBeDefined();
        expect(serviceConfig.setObjNotes).toBeDefined();
        expect(serviceConfig.getObjNotes).toBeDefined();
    });

    it('TDD - Should verify that the method getConfigNotes ' +
        'is able to get the Notes configuration from database', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
           return{
               then: function(callback){
                   var result = {};
                   result.rows = [
                       {
                           id: 1,
                           intervalo_de: 0,
                           intervalo_para: 10,
                           media_minima: 7
                       }
                   ];

                   result.rows.item = function(index){
                       return result.rows[index];
                   };
                   return callback(result);
               }
           }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        serviceConfig.getConfigNotes().then(
            successSpy, failSpy
        );

        $scope.$apply();

        expect(successSpy).toHaveBeenCalledWith({
                id: 1,
                intervalo_de: 0,
                intervalo_para: 10,
                media_minima: 7
            }
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify that the method updateConfigNotes ' +
        'is able to update the Notes configuration in database', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){
                    return callback({
                        rowsAffected: 1
                    });
                }
            }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');
        var data = {
          intervalo_de: 0,
          intervalo_para: 10,
          media_minima: 7
        };

        serviceConfig.updateConfigNotes(data).then(
            successSpy, failSpy
        );

        $scope.$apply();

        expect(successSpy).toHaveBeenCalledWith({rowsAffected: 1});
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify that the method updateConfigNotes ' +
        'warns an alert when a null data is defined', function(){
        spyOn(factoryDatabase, 'executeQuery');

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');
        var data = {
            intervalo_de: null,
            intervalo_para: 10,
            media_minima: 7
        };

        serviceConfig.updateConfigNotes(data).then(
            successSpy, failSpy
        );

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_EMPTY_CONFIG_NOTES.MSG,
            serviceConstants.MSG_EMPTY_CONFIG_NOTES.ALERT,
            serviceConstants.MSG_EMPTY_CONFIG_NOTES.BUTTON
        );

        expect(factoryDatabase.executeQuery).not.toHaveBeenCalled();
    });

});