/**
 * Created by everton on 11/08/15.
 */
describe('Homework controller', function () {

    var HomeworkCtrl, $scope, serviceHomework, $cordovaSQLite,
        $cordovaDialogs, serviceConstants, factoryDatabase;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceHomework = $injector.get('serviceHomework');
        factoryDatabase = $injector.get('factoryDatabase');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');

        spyOn($cordovaSQLite, 'execute') .and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            trabalho: 'P1',
                            data_entrega: new Date('2014-10-10'),
                            observacoes: 'nothing',
                            peso: 2,
                            nota: 7,
                            id_materia: 1,
                            nome: 'matematica'}
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };


                    return callback(result);
                }
            };
        });

        HomeworkCtrl = $controller('HomeworkCtrl', {'$scope': $scope});

    }));

    it('TDD - Should define HomeworkNewCtrl', function(){
       expect(HomeworkCtrl).toBeDefined();
    });

    it('BDD - Cenário: Exibição das Provas na tela ' +
        'Dado que: o usuário entrou na tela Provas ' +
        'Então: a Prova 1 da matéria Matemática será exibida na tela', function(){

        $scope.$apply();

        expect($scope.data.HomeworkList).toEqual([
            {id: 1,
                trabalho: 'P1',
                data_entrega: new Date('2014-10-10'),
                observacoes: 'nothing',
                peso: 2,
                nota: 7,
                id_materia: 1,
                nome: 'matematica'}
        ]);
        var listHomework = serviceHomework.getCurrentHomeworkList();
        expect(listHomework).toEqual([
            {id: 1,
                trabalho: 'P1',
                data_entrega: new Date('2014-10-10'),
                observacoes: 'nothing',
                peso: 2,
                nota: 7,
                id_materia: 1,
                nome: 'matematica'}
        ]);
    });

    it('BDD - Cenário: Atualização dos dados de uma Prova ' +
        'Dado que: O usuário alterou qualquer dado de uma Prova ' +
        'E: fechou a aba da respectiva prova ' +
        'Então: os dados da prova serão atualizados no banco de dados', function(){

        var data = {
            id: 1,
            titulo: 'P1',
            data: new Date('2014-10-11'),
            observacoes: 'nothing',
            peso: 2,
            nota: 7,
            id_materia: 1
        };

        spyOn(serviceHomework, 'updateHomework').and.callFake(function(){
            return {
                then: function(callback){
                    callback(1);
                }
            };
        });

        $scope.updateHomework(data);

        expect(serviceHomework.updateHomework).toHaveBeenCalled();

    });

    it('BDD - Cenário: Exclusão de prova ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma prova ' +
        'E: confirmou a exclusão na caixa de diálogo que surgiu ' +
        'Então: a prova será excluída ' +
        'E: um alerta será exibido informando sucesso na exclusão', function(){

        spyOn(serviceHomework, 'deleteHomework').and.callFake(function(){
           return{
               then: function(callBack){
                    callBack();
               }
           }
        });

        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack(1);
                }
            }
        });

        $scope.deleteHomework(1);
        $scope.$apply();
        expect(serviceHomework.deleteHomework).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_SUCCESS_DELETE_HOMEWORK.MSG,
            serviceConstants.MSG_SUCCESS_DELETE_HOMEWORK.ALERT,
            serviceConstants.MSG_SUCCESS_DELETE_HOMEWORK.BUTTON
        );
    });

    it('BDD - Cenário: Exclusão de prova ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma prova ' +
        'E: confirmou a exclusão na caixa de diálogo que surgiu ' +
        'E: houve um erro na exclusão ' +
        'Então: um alerta será exibido informando falha na exclusão', function(){

        spyOn(serviceHomework, 'deleteHomework').and.callFake(function(){
            return{
                then: function(callBack, callFail){
                    callFail();
                }
            }
        });

        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack(1);
                }
            }
        });

        $scope.deleteHomework(1);
        $scope.$apply();
        expect(serviceHomework.deleteHomework).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_FAIL_DELETE_HOMEWORK.MSG,
            serviceConstants.MSG_FAIL_DELETE_HOMEWORK.ALERT,
            serviceConstants.MSG_FAIL_DELETE_HOMEWORK.BUTTON
        );
    });


    it('BDD - Cenário: Exclusão de prova ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma prova ' +
        'E: não confirmou a exclusão na caixa de diálogo que surgiu ' +
        'Então: a prova não será excluída ', function(){

        spyOn(serviceHomework, 'deleteHomework');

        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack(2);
                }
            }
        });

        $scope.deleteHomework(1);
        expect(serviceHomework.deleteHomework).not.toHaveBeenCalled();
    });

    it('BDD - Cenário: Ordenação da lista de provas ' +
        'Dado que: o usuário clicou no ícone ordenar A-Z ' +
        'Então: a lista de matérias será exibida em ordem alfabética ASCENDENTE  ', function(){
        spyOn(serviceHomework, 'setCurrentSortHomework');
        spyOn(serviceHomework, 'getHomeworks').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack();
                }
            }
        });

        $scope.sortHomeworkList('asc');
        expect(serviceHomework.getHomeworks).toHaveBeenCalledWith('asc');
        expect($scope.sort).toBe('asc');
        expect(serviceHomework.setCurrentSortHomework).toHaveBeenCalledWith('asc');
    });


    it('BDD - Cenário: Ordenação da lista de provas ' +
        'Dado que: o usuário clicou no ícone ordenar Z-A ' +
        'Então: a lista de provas será exibida em ordem alfabética DECRESCENTE  ', function(){

        spyOn(serviceHomework, 'setCurrentSortHomework');
        spyOn(serviceHomework, 'getHomeworks').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack();
                }
            }
        });

        $scope.sortHomeworkList('desc');
        expect(serviceHomework.getHomeworks).toHaveBeenCalledWith('desc');
        expect($scope.sort).toBe('desc');
        expect(serviceHomework.setCurrentSortHomework).toHaveBeenCalledWith('desc');
    });
});


