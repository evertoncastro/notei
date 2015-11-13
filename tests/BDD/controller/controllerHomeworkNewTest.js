/**
 * Created by everton on 22/08/15.
 */
describe('HomeworkNew controller', function () {

    var HomeworkNewCtrl, $scope, serviceHomework, $cordovaDialogs,
        serviceConstants, $state, $cordovaSQLite;

    beforeEach(module('anotei'));


    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceHomework = $injector.get('serviceHomework');
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

        HomeworkNewCtrl = $controller('HomeworkNewCtrl', {'$scope': $scope});
    }));

    it('TDD - Should define HomeworkNewCtrl', function(){
       expect(HomeworkNewCtrl).toBeDefined();
    });

    it('BDD - Cenário: Carregamento do formulário de Criação de Trabalho ' +
        'Dado que: solicitou a página de inclusao de Trabalho ' +
        'Então: um formulário para adicionar uma nova Trabalho será exibido', function(){

        spyOn(serviceHomework, 'getCurrentHomeworkList');

        spyOn(serviceHomework, 'getCurrentHomework').and.callFake(function(){
           return undefined;
        });

        $scope.loadForm();
        expect($scope.title).toBe('Novo Trabalho');
        expect($scope.wayForm).toBe('add');
        expect(serviceHomework.getCurrentHomeworkList).toHaveBeenCalled();
    });

    it('BDD - Cenário: Carregamento do formulário de Edição de Trabalho ' +
        'Dado que: solicitou a página de edição de Trabalho ' +
        'Então: um formulário para edição de uma Trabalho será exibido ' +
        'E: o formulario será carregado com a Trabalho a ser editada', function(){

        spyOn(serviceHomework, 'getCurrentHomeworkList');
        spyOn(serviceHomework, 'getCurrentHomework').and.callFake(function(){
            return {
                trabalho: 'Trabalho 1',
                data: '2015-10-10',
                observacoes: 'nothing',
                peso: 2,
                nota: 8,
                id_materia: 2
            }
        });

        $scope.loadForm();
        expect($scope.title).toBe('Editar Trabalho');
        expect($scope.wayForm).toBe('edit');
        expect(serviceHomework.getCurrentHomeworkList).toHaveBeenCalled();
    });

    it('BDD - Cenário: Inclusão de nova Trabalho; ' +
        'Dado que: o usuário preencheu todos os campos necessários na tela de cadastro ' +
        'E: clicou no botão Gravar ' +
        'Então: um alerta de sucesso será exibido ' +
        'E: o usuário será redirecionado para a tela anterior ', function(){

        var data = {
            trabalho: 'Trabalho 1',
            data_entrega: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        spyOn(serviceHomework, 'insertHomework').and.callFake(function(){
            return {
                then: function(callback){
                    callback(2);
                }
            };
        });
        var wayForm = 'add';
        $scope.manipulateHomework(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_SUCCESS_HOMEWORK_NEW.MSG,
                                                        serviceConstants.MSG_SUCCESS_HOMEWORK_NEW.ALERT,
                                                        serviceConstants.MSG_SUCCESS_HOMEWORK_NEW.BUTTON);

        expect($state.go).toHaveBeenCalledWith('app.homework');
    });

    it('BDD - Cenário: Erro em inclusão de nova Trabalho;' +
        'Dado que: o usuário preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'E: Houve um erro na execução da inserção no banco de dados' +
        'Então: um alerta de falha será exibido' +
        'E: o usuário continuará na mesma página', function(){

        var data = {
            trabalho: 'Trabalho 1',
            data_entrega: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        spyOn(serviceHomework, 'insertHomework').and.callFake(function(){
            return {
                then: function(callback, callFail){
                    callFail();
                }
            };
        });
        var wayForm = 'add';
        $scope.manipulateHomework(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_FAIL_HOMEWORK_NEW.MSG,
                                                           serviceConstants.MSG_FAIL_HOMEWORK_NEW.ALERT,
                                                           serviceConstants.MSG_FAIL_HOMEWORK_NEW.BUTTON);

    });

    it('BDD - Cenário: Tentativa de inclusão de nova Trabalho com campos obrigatorios vazios;' +
        'Dado que: o usuário não preencheu todos os campos necessarios na tela de cadastro' +
        'E: clicou no botão Gravar' +
        'Então: um alerta de falha será exibido' +
        'E: o usuário continuará na mesma página', function(){

        var data = {
            trabalho: null,
            data: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        $scope.manipulateHomework(data);

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_INCOMPLETE_HOMEWORK_NEW.MSG+'"Nome"',
            serviceConstants.MSG_INCOMPLETE_HOMEWORK_NEW.ALERT,
            serviceConstants.MSG_INCOMPLETE_HOMEWORK_NEW.BUTTON);

    });

    //Tests for update
    it('BDD - Cenário: Edição dos dados de uma Trabalho; ' +
        'Dado que: o usuário preencheu todos os campos necessários na tela de edição ' +
        'E: clicou no botão Gravar ' +
        'Então: um alerta de sucesso será exibido ' +
        'E: o usuário será redirecionado para a tela anterior ', function(){

        var data = {
            trabalho: 'Trabalho 1',
            data_entrega: '2015-10-10',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 2
        };

        spyOn(serviceHomework, 'updateHomework').and.callFake(function(){
            return {
                then: function(callback){
                    callback();
                }
            };
        });
        var wayForm = 'edit';
        $scope.manipulateHomework(data, wayForm);
        $scope.$apply();

        expect($cordovaDialogs.alert).toHaveBeenCalledWith(serviceConstants.MSG_UPDATE_TITLE_HOMEWORK.MSG,
            serviceConstants.MSG_UPDATE_TITLE_HOMEWORK.ALERT,
            serviceConstants.MSG_UPDATE_TITLE_HOMEWORK.BUTTON);

        expect($state.go).toHaveBeenCalledWith('app.homework');
    });
});


