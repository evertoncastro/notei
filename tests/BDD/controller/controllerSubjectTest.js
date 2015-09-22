/**
 * Created by everton on 06/08/15.
 */
describe('Subject controller', function () {

    var SubjectCtrl, $scope, serviceSubject, $cordovaSQLite,
        $cordovaDialogs, serviceConstants, serviceValidation;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceValidation = $injector.get('serviceValidation');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');

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

        SubjectCtrl = $controller('SubjectCtrl', {'$scope': $scope});

    }));

    it('TDD - Should define SubjectNewCtrl', function(){
       expect(SubjectCtrl).toBeDefined();
    });

    it('BDD - Cenário: Exibição das matérias na tela ' +
        'Dado que: o usuário entrou na tela Matérias ' +
        'Então: a matéria Matemática será exibida na tela', function(){

        $scope.$apply();

        expect($scope.data.subjectList).toEqual([
            {id: 1,
                nome: 'Matemática',
                max_faltas: 20,
                professor: 'Everton de Castro',
                email_prof: 'evertoncastro.sp@gmail.com',
                num_faltas: 5}
        ]);
    });



    it('BDD - Cenário: Atualização dos dados de uma Matéria ' +
        'Dado que: O usuário alterou qualquer dado de uma matéria ' +
        'E: fechou a aba da respectiva matéria ' +
        'Então: os dados da matéria serão atualizados no banco de dados', function(){

        var data = {
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com',
            num_faltas: 4,
            id: 1
        };

        spyOn(serviceSubject, 'updateSubject').and.callFake(function(){
            return {
                then: function(callback){
                    callback(1);
                }
            };
        });

        $scope.updateSubject(data);

        expect(serviceSubject.updateSubject).toHaveBeenCalled();

    });

    it('BDD - Cenário: Exclusão de matéria ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma matéria ' +
        'E: confirmou a exclusão na caixa de diálogo que surgiu ' +
        'Então: a matéria será excluída ' +
        'E: um alerta será exibido informando sucesso na exclusão', function(){

        spyOn(serviceSubject, 'deleteSubject').and.callFake(function(){
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

        $scope.deleteSubject(1);
        $scope.$apply();
        expect(serviceSubject.deleteSubject).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_SUCCESS_DELETE_SUBJECT.MSG,
            serviceConstants.MSG_SUCCESS_DELETE_SUBJECT.ALERT,
            serviceConstants.MSG_SUCCESS_DELETE_SUBJECT.BUTTON
        );
    });

    it('BDD - Cenário: Exclusão de matéria ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma matéria ' +
        'E: confirmou a exclusão na caixa de diálogo que surgiu ' +
        'E: houve um erro na exclusão ' +
        'Então: um alerta será exibido informando falha na exclusão', function(){

        spyOn(serviceSubject, 'deleteSubject').and.callFake(function(){
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

        $scope.deleteSubject(1);
        $scope.$apply();
        expect(serviceSubject.deleteSubject).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_FAIL_DELETE_SUBJECT.MSG,
            serviceConstants.MSG_FAIL_DELETE_SUBJECT.ALERT,
            serviceConstants.MSG_FAIL_DELETE_SUBJECT.BUTTON
        );
    });


    it('BDD - Cenário: Exclusão de matéria ' +
        'Dado que: o usuário clicou no ícone de exclusão em alguma matéria ' +
        'E: não confirmou a exclusão na caixa de diálogo que surgiu ' +
        'Então: a matéria não será excluída ', function(){

        spyOn(serviceSubject, 'deleteSubject');

        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack(2);
                }
            }
        });

        $scope.deleteSubject(1);
        expect(serviceSubject.deleteSubject).not.toHaveBeenCalled();
    });

    it('BDD - Cenário: Ordenação da lista de matérias ' +
        'Dado que: o usuário clicou no ícone ordenar ASCENDENTE ' +
        'Então: a lista de matérias será exibida em ordem alfabética ASCENDENTE  ', function(){
        spyOn(serviceSubject, 'setCurrentSortSubject');
        spyOn(serviceSubject, 'getSubjects').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack();
                }
            }
        });

        $scope.sortSubjectList('asc');
        expect(serviceSubject.getSubjects).toHaveBeenCalledWith('asc');
        expect($scope.sort).toBe('asc');
        expect(serviceSubject.setCurrentSortSubject).toHaveBeenCalledWith('asc');
    });


    it('BDD - Cenário: Ordenação da lista de matérias ' +
        'Dado que: o usuário clicou no ícone ordenar DECRESCENTE ' +
        'Então: a lista de matérias será exibida em ordem alfabética DECRESCENTE  ', function(){

        spyOn(serviceSubject, 'setCurrentSortSubject');
        spyOn(serviceSubject, 'getSubjects').and.callFake(function(){
            return{
                then: function(callBack){
                    callBack();
                }
            }
        });

        $scope.sortSubjectList('desc');
        expect(serviceSubject.getSubjects).toHaveBeenCalledWith('desc');
        expect($scope.sort).toBe('desc');
        expect(serviceSubject.setCurrentSortSubject).toHaveBeenCalledWith('desc');
    });

    it('BDD - Cenário: Alteração dos valores no inputs de faltas e máximo de faltas' +
        'Dado que: o usuário inseriru o valor 25' +
        'Então: o dado será atualizado no banco de dados',function(){

        spyOn(serviceValidation, 'validateInputAttendance').and.callThrough();
        spyOn(serviceSubject, 'updateSubject');
        $scope.oldValue = 20;
        $scope.data.subjectList = [
            {max_faltas: 20, num_faltas: 40},
            {max_faltas: 20, num_faltas: 10}
        ];

        expect($scope.validateInputAttendance).toBeDefined();
        $scope.validateInputAttendance({max_faltas: 25, num_faltas: 40}, 0, 'max_faltas');
        expect(serviceValidation.validateInputAttendance).toHaveBeenCalledWith(
            {newValue: 25, oldValue: 20}
        );
        expect($scope.data.subjectList).toEqual([
            {max_faltas: 25, num_faltas: 40},
            {max_faltas: 20, num_faltas: 10}
        ]);

        expect(serviceSubject.updateSubject).toHaveBeenCalled();
    });

    it('BDD - Cenário: Alteração dos valores no inputs de faltas e máximo de faltas' +
        'Dado que: o usuário inseriru um valor com caractere inválido ou espaço' +
        'Então: uma mensagem surgirá na tela informando inconsistência',function(){

        spyOn(serviceValidation, 'validateInputAttendance').and.callThrough();
        spyOn(serviceSubject, 'updateSubject');
        $scope.oldValue = 20;
        $scope.data.subjectList = [
            {max_faltas: 20, num_faltas: 5},
            {max_faltas: 20, num_faltas: 10}
        ];

        expect($scope.validateInputAttendance).toBeDefined();
        $scope.validateInputAttendance({max_faltas: '$$', num_faltas: 7}, 0, 'max_faltas');
        expect(serviceValidation.validateInputAttendance).toHaveBeenCalledWith(
            {newValue: '$$', oldValue: 20}
        );
        expect($cordovaDialogs.alert).toHaveBeenCalled();
        expect($scope.data.subjectList).toEqual([
            {max_faltas: 20, num_faltas: 5},
            {max_faltas: 20, num_faltas: 10}
        ]);

        expect(serviceSubject.updateSubject).not.toHaveBeenCalled();
    });

    it('BDD - Cenário: Alteração dos valores no inputs de faltas e máximo de faltas' +
        'Dado que: o usuário inseriru um valor maior que 99' +
        'Então: uma mensagem surgirá na tela informando inconsistência',function(){

        spyOn(serviceValidation, 'validateInputAttendance').and.callThrough();
        spyOn(serviceSubject, 'updateSubject');
        $scope.oldValue = 40;
        $scope.data.subjectList = [
            {max_faltas: 20, num_faltas: 40},
            {max_faltas: 20, num_faltas: 10}
        ];

        expect($scope.validateInputAttendance).toBeDefined();
        $scope.validateInputAttendance({max_faltas: 20, num_faltas: 100}, 0, 'num_faltas');
        expect(serviceValidation.validateInputAttendance).toHaveBeenCalledWith(
            {newValue: 100, oldValue: 40}
        );
        expect($cordovaDialogs.alert).toHaveBeenCalled();
        expect($scope.data.subjectList).toEqual([
            {max_faltas: 20, num_faltas: 40},
            {max_faltas: 20, num_faltas: 10}
        ]);

        expect(serviceSubject.updateSubject).not.toHaveBeenCalled();
    })

});


