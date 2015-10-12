/**
 * Created by everton on 05/09/15.
 */
describe('Service Contact Test', function() {
    var $scope, serviceContact, $cordovaEmailComposer;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $httpBackend) {
        var rootScope = $injector.get('$rootScope');
        serviceContact = $injector.get('serviceContact');
        $cordovaEmailComposer = $injector.get('$cordovaEmailComposer');
        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));


    it('TDD - Should verify if the function sendEmail calls the ' +
        'plugin email composer', function(){
        spyOn($cordovaEmailComposer, 'open').and.callFake(function(){
            return{
                then: function(callBack, callFail){
                    return callBack();
                }
            }
        });
        spyOn($cordovaEmailComposer, 'isAvailable').and.callFake(function(){
            return{
                then: function(callBack, callFail){
                    return callBack();
                }
            }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        serviceContact.sendEmail('suggestion').then(
            successSpy, failSpy
        );

        expect($cordovaEmailComposer.open).toHaveBeenCalledWith({
            to: 'evertoncastro.sp@gmail.com',
            subject: 'Sugestões para o aplicativo Anotei',
            body: '',
            isHtml: false
        });

    });

});