/**
 * Created by everton on 05/08/15.
 */
describe('SubjectNew controller', function () {

    var SubjectNewCtrl, $scope, serviceSubject, $cordovaDialogs,
        serviceConstants, $state, serviceValidation;

    beforeEach(module('anotei'));


    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        $state = $injector.get('$state');
        serviceValidation = $injector.get('serviceValidation');
        SubjectNewCtrl = $controller('SubjectNewCtrl', {'$scope': $scope});

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');
        spyOn($state, 'go');
        spyOn($scope, '$broadcast');
    }));

    it('TDD - Should define SubjectNewCtrl', function(){
       expect(SubjectNewCtrl).toBeDefined();
    });

    it('BDD - Cenário: Carregamento do formulário de Criação de Matéria ' +
        'Dado que: solicitou a página de inclusao de matéria ' +
        'Então: um formulário para adicionar uma nova matéria será exibido', function(){

        spyOn(serviceSubject, 'getCurrentSubject').and.callFake(function(){
           return undefined;
        });

        $scope.loadForm();
        expect($scope.title).toBe('Nova Matéria');
        expect($scope.wayForm).toBe('add');
    });

    it('BDD - Cenário: Carregamento do formulário de Edição de Matéria ' +
        'Dado que: solicitou a página de edição de matéria ' +
        'Então: um formulário para edição de uma matéria será exibido ' +
        'E: o formulario será carregado com a matéria a ser editada', function(){

        spyOn(serviceSubject, 'getCurrentSubject').and.callFake(function(){
            return {
                id: 1,
                nome: 'Programação 2',
                max_faltas: 20,
                professor: 'Everton de Castro',
                email_prof: 'evertoncastro.sp@gmail.com',
                nota: 8
            }
        });

        $scope.loadForm();
        expect($scope.title).toBe('Editar Matéria');
        expect($scope.wayForm).toBe('edit');
    });

    it('BDD - Cenário: Inclusão de nova matéria; ' +
        'Dado que: o usuário preencheu todos os campos necessários na tela de cadastro ' +
        'E: clicou no botão Gravar ' +
        'Então: um alerta de sucesso será exibido ' +
        'E: o usuário será redirecionado para a tela anterior ', function(){

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
        var wayForm = 'add';
        $scope.manipulateSubject(data, wayForm);
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
        var wayForm = 'add';
        $scope.manipulateSubject(data, wayForm);
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

        $scope.manipulateSubject(data);

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.MSG+'"Número máximo de faltas"',
            serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.ALERT,
            serviceConstants.MSG_INCOMPLETE_SUBJECT_NEW.BUTTON);

    });

    //Tests for update
    it('BDD - Cenário: Edição dos dados de uma matéria; ' +
        'Dado que: o usuário preencheu todos os campos necessários na tela de edição ' +
        'E: clicou no botão Gravar ' +
        'Então: um alerta de sucesso será exibido ' +
        'E: o usuário será redirecionado para a tela anterior ', function(){

        var data = {
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        spyOn(serviceSubject, 'updateSubject').and.callFake(function(){
            return {
                then: function(callback){
                    callback();
                }
            };
        });
        var wayForm = 'edit';
        $scope.manipulateSubject(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_UPDATE_TITLE_SUBJECT.MSG,
            serviceConstants.MSG_UPDATE_TITLE_SUBJECT.ALERT,
            serviceConstants.MSG_UPDATE_TITLE_SUBJECT.BUTTON);

        expect($state.go).toHaveBeenCalledWith('app.subjects');
    });

    it('BDD - Cenário: Inserção do número de faltas' +
        'Dado que: o usuário inseriru um valor maior que 99' +
        'Então: uma mensagem surgirá na tela informando inconsistência',function(){

        spyOn(serviceValidation, 'validateInputAttendance').and.callThrough();
        $scope.oldValue = 30;
        $scope.data = {max_faltas: 10};

        expect($scope.validateInputAttendance).toBeDefined();
        $scope.validateInputAttendance(101);
        expect(serviceValidation.validateInputAttendance).toHaveBeenCalledWith(
            {newValue: 101, oldValue: 30}
        );
        expect($cordovaDialogs.alert).toHaveBeenCalled();
        expect($scope.data.max_faltas).toEqual(30);
    });

    it('BDD - Cenário: Inserção do número de faltas' +
        'Dado que: o usuário inseriru um valor com caractere especial' +
        'Então: uma mensagem surgirá na tela informando inconsistência',function(){

        spyOn(serviceValidation, 'validateInputAttendance').and.callThrough();
        $scope.oldValue = 30;
        $scope.data = {max_faltas: 10};

        expect($scope.validateInputAttendance).toBeDefined();
        $scope.validateInputAttendance('10@@');
        expect(serviceValidation.validateInputAttendance).toHaveBeenCalledWith(
            {newValue: '10@@', oldValue: 30}
        );
        expect($cordovaDialogs.alert).toHaveBeenCalled();
        expect($scope.data.max_faltas).toEqual(30);
    });


    it('BDD - Cenário: Inserção do número de faltas' +
        'Dado que: o usuário inseriru um valor maior que 0 e menor que 99' +
        'Então: uma mensagem não surgirá',function(){

        spyOn(serviceValidation, 'validateInputAttendance').and.callThrough();
        $scope.oldValue = 30;
        $scope.data = {max_faltas: 10};

        expect($scope.validateInputAttendance).toBeDefined();
        $scope.validateInputAttendance(25);
        expect(serviceValidation.validateInputAttendance).toHaveBeenCalledWith(
            {newValue: 25, oldValue: 30}
        );
        expect($cordovaDialogs.alert).not.toHaveBeenCalled();
        expect($scope.data.max_faltas).toEqual(25);
    })
});


