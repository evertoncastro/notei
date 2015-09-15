/**
 * Created by everton on 7/09/15.
 */
describe('Service Util Test', function(){
    var serviceValidation, $scope, serviceConfig, $cordovaDialogs, serviceConstants;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceValidation = $injector.get('serviceValidation');
        serviceConfig = $injector.get('serviceConfig');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceConstants = $injector.get('serviceConstants');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));

    it('TDD - Should compare the parameter for notes with the data ' +
        'configuration', function(){
        spyOn(serviceConfig, 'getObjNotes').and.callFake(function(){
            return {
                id: 1,
                intervalo_de: 0,
                intervalo_para: 10,
                media_minima: 6
            }
        });

        spyOn($cordovaDialogs, 'alert');

        var note = {
            newValue: '11rewre',
            oldValue: 7
        };
        var validation = serviceValidation.validateInput(note);
        expect(serviceValidation.validateInput).toBeDefined();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
            serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
            serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);
        expect(validation).toBe(7);
    });

    it('TDD - Should compare the parameter for notes with the data ' +
        'configuration', function(){
        spyOn(serviceConfig, 'getObjNotes').and.callFake(function(){
            return {
                id: 1,
                intervalo_de: 0,
                intervalo_para: 10,
                media_minima: 6
            }
        });

        spyOn($cordovaDialogs, 'alert');

        var note = {
            newValue: 11,
            oldValue: 7
        };
        var validation = serviceValidation.validateInput(note);
        expect(serviceValidation.validateInput).toBeDefined();
        expect(serviceConfig.getObjNotes).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.MSG+0+' e '+10,
            serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.ALERT,
            serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.BUTTON);
        expect(validation).toBe(7);
    });

    it('TDD - Should compare the parameter for notes with the data ' +
        'configuration', function(){
        spyOn(serviceConfig, 'getObjNotes').and.callFake(function(){
            return {
                id: 1,
                intervalo_de: 0,
                intervalo_para: 10,
                media_minima: 6
            }
        });
        var note = {
            newValue: 8,
            oldValue: 7
        };
        var validation = serviceValidation.validateInput(note);
        expect(serviceValidation.validateInput).toBeDefined();
        expect(serviceConfig.getObjNotes).toHaveBeenCalled();
        expect(validation).toBe(8);
    });
});