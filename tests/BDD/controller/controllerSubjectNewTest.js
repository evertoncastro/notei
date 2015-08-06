/**
 * Created by everton on 05/08/15.
 */
describe('SubjectNew controller', function () {

    var SubjectNewCtrl, $scope, serviceSubject, $cordovaDialogs, serviceConstants, $state;

    beforeEach(module('anotei'));


    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        $state = $injector.get('$state');
        SubjectNewCtrl = $controller('SubjectNewCtrl', {'$scope': $scope})

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');
        spyOn($state, 'go');
    }));

    it('TDD - Should define SubjectNewCtrl', function(){
       expect(SubjectNewCtrl).toBeDefined();
    });

    it('BDD - Cenário: Inclusão de nova matéria;' +
        'Dado que: o usuário preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'Então: um alerta de sucesso será exibido' +
        'E: o usuário será redirecionado para a tela anterior', function(){

        var data = {
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        spyOn(serviceSubject, 'insertSubject').and.callFake(function(){
            return {
                then: function(callback){
                    callback(2);
                }
            };
        });

        $scope.insertSubject(data);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_SUCCESS_SUBJECT_NEW.MSG,
                                                        serviceConstants.MSG_SUCCESS_SUBJECT_NEW.ALERT,
                                                        serviceConstants.MSG_SUCCESS_SUBJECT_NEW.BUTTON);

        expect($state.go).toHaveBeenCalledWith('app.subjects');
    });

    it('BDD - Cenário: Erro em inclusão de nova matéria;' +
        'Dado que: o usuário preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'E: Houve um erro na execução da inserção no banco de dados' +
        'Então: um alerta de falha será exibido' +
        'E: o usuário continuará na mesma página', function(){

        var data = {
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        spyOn(serviceSubject, 'insertSubject').and.callFake(function(){
            return {
                then: function(callback, callFail){
                    callFail();
                }
            };
        });

        $scope.insertSubject(data);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_FAIL_SUBJECT_NEW.MSG,
                                                           serviceConstants.MSG_FAIL_SUBJECT_NEW.ALERT,
                                                           serviceConstants.MSG_FAIL_SUBJECT_NEW.BUTTON);

    });

    it('BDD - Cenário: Tentativa de inclusão de nova matéria com campos obrigatorios vazios;' +
        'Dado que: o usuário não preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'Então: um alerta de falha será exibido' +
        'E: o usuário continuará na mesma página', function(){

        var data = {
            nome: 'Programação 2',
            max_faltas: null,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        $scope.insertSubject(data);

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.MSG+'"Número máximo de faltas"',
            serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.ALERT,
            serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.BUTTON);

    });


});


