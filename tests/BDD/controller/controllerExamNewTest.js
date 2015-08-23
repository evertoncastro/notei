/**
 * Created by everton on 22/08/15.
 */
describe('ExamNew controller', function () {

    var ExamNewCtrl, $scope, serviceExam, $cordovaDialogs,
        serviceConstants, $state, $cordovaSQLite;

    beforeEach(module('anotei'));


    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceExam = $injector.get('serviceExam');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        $state = $injector.get('$state');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');
        spyOn($state, 'go');
        spyOn($scope, '$broadcast');

        spyOn($cordovaSQLite, 'execute') .and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            nome: 'Matemática',
                            max_faltas: 20,
                            professor: 'Everton de Castro',
                            email_prof: 'evertoncastro.sp@gmail.com',
                            num_faltas: 5}
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };


                    return callback(result);
                }
            };
        });

        ExamNewCtrl = $controller('ExamNewCtrl', {'$scope': $scope});
    }));

    it('TDD - Should define ExamNewCtrl', function(){
       expect(ExamNewCtrl).toBeDefined();
    });

    it('BDD - Cenário: Carregamento do formulário de Criação de Prova ' +
        'Dado que: solicitou a página de inclusao de Prova ' +
        'Então: um formulário para adicionar uma nova Prova será exibido', function(){

        spyOn(serviceExam, 'getCurrentExam').and.callFake(function(){
           return undefined;
        });

        $scope.loadForm();
        expect($scope.title).toBe('Nova Prova');
        expect($scope.wayForm).toBe('add');
    });

    it('BDD - Cenário: Carregamento do formulário de Edição de Prova ' +
        'Dado que: solicitou a página de edição de Prova ' +
        'Então: um formulário para edição de uma Prova será exibido ' +
        'E: o formulario será carregado com a Prova a ser editada', function(){

        spyOn(serviceExam, 'getCurrentExam').and.callFake(function(){
            return {
                titulo: 'Prova 1',
                data: '2015-10-10',
                observacoes: 'nothing',
                peso: 2,
                nota: 8,
                id_materia: 2
            }
        });

        $scope.loadForm();
        expect($scope.title).toBe('Editar Prova');
        expect($scope.wayForm).toBe('edit');
    });

    it('BDD - Cenário: Inclusão de nova Prova; ' +
        'Dado que: o usuário preencheu todos os campos necessários na tela de cadastro ' +
        'E: clicou no botão Gravar ' +
        'Então: um alerta de sucesso será exibido ' +
        'E: o usuário será redirecionado para a tela anterior ', function(){

        var data = {
            titulo: 'Prova 1',
            data: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        spyOn(serviceExam, 'insertExam').and.callFake(function(){
            return {
                then: function(callback){
                    callback(2);
                }
            };
        });
        var wayForm = 'add';
        $scope.manipulateExam(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_SUCCESS_EXAM_NEW.MSG,
                                                        serviceConstants.MSG_SUCCESS_EXAM_NEW.ALERT,
                                                        serviceConstants.MSG_SUCCESS_EXAM_NEW.BUTTON);

        expect($state.go).toHaveBeenCalledWith('app.exam');
    });

    it('BDD - Cenário: Erro em inclusão de nova Prova;' +
        'Dado que: o usuário preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'E: Houve um erro na execução da inserção no banco de dados' +
        'Então: um alerta de falha será exibido' +
        'E: o usuário continuará na mesma página', function(){

        var data = {
            titulo: 'Prova 1',
            data: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        spyOn(serviceExam, 'insertExam').and.callFake(function(){
            return {
                then: function(callback, callFail){
                    callFail();
                }
            };
        });
        var wayForm = 'add';
        $scope.manipulateExam(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_FAIL_EXAM_NEW.MSG,
                                                           serviceConstants.MSG_FAIL_EXAM_NEW.ALERT,
                                                           serviceConstants.MSG_FAIL_EXAM_NEW.BUTTON);

    });

    it('BDD - Cenário: Tentativa de inclusão de nova Prova com campos obrigatorios vazios;' +
        'Dado que: o usuário não preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'Então: um alerta de falha será exibido' +
        'E: o usuário continuará na mesma página', function(){

        var data = {
            titulo: null,
            data: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        $scope.manipulateExam(data);

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_INCOMPLETE_EXAM_NEW.MSG+'"Título"',
            serviceConstants.MSG_INCOMPLETE_EXAM_NEW.ALERT,
            serviceConstants.MSG_INCOMPLETE_EXAM_NEW.BUTTON);

    });

    //Tests for update
    it('BDD - Cenário: Edição dos dados de uma Prova; ' +
        'Dado que: o usuário preencheu todos os campos necessários na tela de edição ' +
        'E: clicou no botão Gravar ' +
        'Então: um alerta de sucesso será exibido ' +
        'E: o usuário será redirecionado para a tela anterior ', function(){

        var data = {
            titulo: 'Prova 1',
            data: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        spyOn(serviceExam, 'updateExam').and.callFake(function(){
            return {
                then: function(callback){
                    callback();
                }
            };
        });
        var wayForm = 'edit';
        $scope.manipulateExam(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_UPDATE_TITLE_EXAM.MSG,
            serviceConstants.MSG_UPDATE_TITLE_EXAM.ALERT,
            serviceConstants.MSG_UPDATE_TITLE_EXAM.BUTTON);

        expect($state.go).toHaveBeenCalledWith('app.exam');
    });
});


