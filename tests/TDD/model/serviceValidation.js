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

        spyOn(serviceValidation,'setStatusValidation');

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
        var validation = serviceValidation.validateInputNotes(note);
        expect(serviceValidation.validateInputNotes).toBeDefined();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
            serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
            serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);
        expect(validation).toBe(7);
        expect(serviceValidation.setStatusValidation).toHaveBeenCalled();
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
        var validation = serviceValidation.validateInputNotes(note);
        expect(serviceValidation.validateInputNotes).toBeDefined();
        expect(serviceConfig.getObjNotes).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.MSG+0+' e '+10,
            serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.ALERT,
            serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.BUTTON);
        expect(validation).toBe(7);
        expect(serviceValidation.setStatusValidation).toHaveBeenCalled();
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
        var validation = serviceValidation.validateInputNotes(note);
        expect(serviceValidation.validateInputNotes).toBeDefined();
        expect(serviceConfig.getObjNotes).toHaveBeenCalled();
        expect(validation).toBe(8);
        expect(serviceValidation.setStatusValidation).toHaveBeenCalled();
    });

    it('TDD - Should validate the data input for attendance ' +
        'and return the newValue when the input is ok', function(){
        var note = {
            newValue: 20,
            oldValue: 7
        };
        var validation = serviceValidation.validateInputNotes(note);
        expect(serviceValidation.validateInputAttendance).toBeDefined();
        expect(validation).toBe(20);
        expect(serviceValidation.setStatusValidation).toHaveBeenCalledWith(true);
    });

    it('TDD - Should validate the data input for attendance and display ' +
        'a dialog informing invalid character', function(){
        spyOn($cordovaDialogs, 'alert');

        var note = {
            newValue: '20$$',
            oldValue: 7
        };
        var validation = serviceValidation.validateInputAttendance(note);
        expect(serviceValidation.validateInputAttendance).toBeDefined();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
            serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
            serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);
        expect(validation).toBe(7);
        expect(serviceValidation.setStatusValidation).toHaveBeenCalledWith(false);
    });

    it('TDD - Should validate the data input for attendance and display ' +
        'a dialog informing value greater than 100', function(){
        spyOn($cordovaDialogs, 'alert');

        var note = {
            newValue: 100,
            oldValue: 7
        };
        debugger;
        var validation = serviceValidation.validateInputAttendance(note);
        expect(serviceValidation.validateInputAttendance).toBeDefined();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_LARGE_INPUT_ATTENDANCE.MSG,
            serviceConstants.MSG_LARGE_INPUT_ATTENDANCE.ALERT,
            serviceConstants.MSG_LARGE_INPUT_ATTENDANCE.BUTTON);
        expect(validation).toBe(7);
        expect(serviceValidation.setStatusValidation).toHaveBeenCalledWith(false);
    });

    it('TDD - Should define getters and setters for statusValidation', function(){
        expect(serviceValidation.setStatusValidation).toBeDefined();
        expect(serviceValidation.getStatusValidation).toBeDefined();
    });
});