/**
 * Created by everton on 06/08/15.
 */
describe('Contato', function () {

    var ContactCtrl, $scope, serviceContact;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceContact = $injector.get('serviceContact');
        $httpBackend.whenGET(/templates\/.*/).respond(200);

        ContactCtrl = function(){
            return $controller('ContactCtrl', {'$scope': $scope});
        };
    }));

    it('BDD - Cenário: Envio de sugestão por email ' +
        'Dado que: o usuário clicou no link \'Sugestão\' ' +
        'Então: o gerenciador de email será aberto', function(){
        expect(ContactCtrl).toBeDefined();
        spyOn(serviceContact, 'sendEmail');
        ContactCtrl();
        $scope.sendEmail('suggestion');
        expect(serviceContact.sendEmail).toHaveBeenCalled();
    });

    it('BDD - Cenário: Envio de erros por email ' +
        'Dado que: o usuário clicou no link \'Relatar Erros\' ' +
        'Então: o gerenciador de email será aberto', function(){
        expect(ContactCtrl).toBeDefined();
        spyOn(serviceContact, 'sendEmail');
        ContactCtrl();
        $scope.sendEmail('error');
        expect(serviceContact.sendEmail).toHaveBeenCalled();
    })
});


