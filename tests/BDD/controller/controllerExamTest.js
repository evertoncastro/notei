/**
 * Created by everton on 11/08/15.
 */
describe('Exam controller', function () {

    var ExamCtrl, $scope, serviceExam, $cordovaSQLite,
        $cordovaDialogs, serviceConstants, factoryDatabase;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceExam = $injector.get('serviceExam');
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
                            titulo: 'P1',
                            data: new Date('2014-10-10'),
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

        ExamCtrl = $controller('ExamCtrl', {'$scope': $scope});

    }));

    it('TDD - Should define ExamNewCtrl', function(){
       expect(ExamCtrl).toBeDefined();
    });

    it('BDD - Cenário: Exibição das Provas na tela ' +
        'Dado que: o usuário entrou na tela Provas ' +
        'Então: a Prova 1 da matéria Matemática será exibida na tela', function(){

        $scope.$apply();

        expect($scope.data.examList).toEqual([
            {id: 1,
                titulo: 'P1',
                data: new Date('2014-10-11'),
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

        spyOn(serviceExam, 'updateExam').and.callFake(function(){
            return {
                then: function(callback){
                    callback(1);
                }
            };
        });

        $scope.updateExam(data);

        expect(serviceExam.updateExam).toHaveBeenCalled();

    });

    it('BDD - Cenário: Exclusão de prova ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma prova ' +
        'E: confirmou a exclusão na caixa de diálogo que surgiu ' +
        'Então: a prova será excluída ' +
        'E: um alerta será exibido informando sucesso na exclusão', function(){

        spyOn(serviceExam, 'deleteExam').and.callFake(function(){
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

        $scope.deleteExam(1);
        $scope.$apply();
        expect(serviceExam.deleteExam).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_SUCCESS_DELETE_EXAM.MSG,
            serviceConstants.MSG_SUCCESS_DELETE_EXAM.ALERT,
            serviceConstants.MSG_SUCCESS_DELETE_EXAM.BUTTON
        );
    });

    it('BDD - Cenário: Exclusão de prova ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma prova ' +
        'E: confirmou a exclusão na caixa de diálogo que surgiu ' +
        'E: houve um erro na exclusão ' +
        'Então: um alerta será exibido informando falha na exclusão', function(){

        spyOn(serviceExam, 'deleteExam').and.callFake(function(){
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

        $scope.deleteExam(1);
        $scope.$apply();
        expect(serviceExam.deleteExam).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_FAIL_DELETE_EXAM.MSG,
            serviceConstants.MSG_FAIL_DELETE_EXAM.ALERT,
            serviceConstants.MSG_FAIL_DELETE_EXAM.BUTTON
        );
    });


    it('BDD - Cenário: Exclusão de prova ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma prova ' +
        'E: não confirmou a exclusão na caixa de diálogo que surgiu ' +
        'Então: a prova não será excluída ', function(){

        spyOn(serviceExam, 'deleteExam');

        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack(2);
                }
            }
        });

        $scope.deleteExam(1);
        expect(serviceExam.deleteExam).not.toHaveBeenCalled();
    });

    it('BDD - Cenário: Ordenação da lista de provas ' +
        'Dado que: o usuário clicou no ícone ordenar A-Z ' +
        'Então: a lista de matérias será exibida em ordem alfabética ASCENDENTE  ', function(){
        spyOn(serviceExam, 'setCurrentSortExam');
        spyOn(serviceExam, 'getExams').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack();
                }
            }
        });

        $scope.sortExamList('asc');
        expect(serviceExam.getExams).toHaveBeenCalledWith('asc');
        expect($scope.sort).toBe('asc');
        expect(serviceExam.setCurrentSortExam).toHaveBeenCalledWith('asc');
    });


    it('BDD - Cenário: Ordenação da lista de provas ' +
        'Dado que: o usuário clicou no ícone ordenar Z-A ' +
        'Então: a lista de provas será exibida em ordem alfabética DECRESCENTE  ', function(){

        spyOn(serviceExam, 'setCurrentSortExam');
        spyOn(serviceExam, 'getExams').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack();
                }
            }
        });

        $scope.sortExamList('desc');
        expect(serviceExam.getExams).toHaveBeenCalledWith('desc');
        expect($scope.sort).toBe('desc');
        expect(serviceExam.setCurrentSortExam).toHaveBeenCalledWith('desc');
    });
});


