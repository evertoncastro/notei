/**
 * Created by everton on 06/08/15.
 */
describe('Área de anotação controller', function () {

    var DashBoardCtrl, $scope, serviceSubject, $cordovaSQLite,
        $cordovaDialogs, serviceConstants, serviceDashBoard,
        serviceConfig;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        serviceDashBoard = $injector.get('serviceDashBoard');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceConfig = $injector.get('serviceConfig');

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

        var Modal = function() {void(0);};
        Modal.prototype.show = function() {void(0);};
        Modal.prototype.hide = function() {void(0);};
        $scope.modal = new Modal();


        DashBoardCtrl = $controller('DashBoardCtrl', {'$scope': $scope});


    }));

    it('TDD - Should define SubjectNewCtrl', function(){
       expect(DashBoardCtrl).toBeDefined();
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

    it('BDD - Cenário: Exibição das atividades no detalhe da matéria ' +
        'Dado que: o usuário clicou em uma matéria ' +
        'E: que o modal surgiu na tela ' +
        'Então: todas as provas e trabalhos daquela matéria serão exibidos no modal', function(){
        spyOn(serviceDashBoard, 'mountList').and.callFake(function(){
            return{
                then: function(callback){
                    var result = [
                        {id: 1, nome: 'P1', peso: 2,
                         nota: 7, id_materia: 1, ativo: true},
                        {id: 1, nome: 'Teste', peso: 2,
                         nota: 7, id_materia: 1, ativo: true}
                    ];

                    return callback(result);
                }
            };
        });

        spyOn(serviceDashBoard, 'calcAverage').and.callThrough();

        expect($scope.loadActivities).toBeDefined();
        var subject = {
            id: 1, nome: 'Matemática', max_faltas: 20,
            professor: 'Everton de Castro', email_prof: 'evertoncastro.sp@gmail.com',
            num_faltas: 5
        };
        $scope.loadActivities(subject);
        $scope.$apply();
        expect(serviceDashBoard.mountList).toHaveBeenCalled();
        expect($scope.data.listActivities).toEqual([
                {id: 1, nome: 'P1', peso: 2,
                    nota: 7, id_materia: 1, ativo: true},
                {id: 1, nome: 'Teste', peso: 2,
                    nota: 7, id_materia: 1, ativo: true}
            ]
        );
        expect($scope.data.subject).toEqual({
            id: 1, nome: 'Matemática', max_faltas: 20,
            professor: 'Everton de Castro', email_prof: 'evertoncastro.sp@gmail.com',
            num_faltas: 5
        });

        expect(serviceDashBoard.calcAverage).toHaveBeenCalledWith([
            {id: 1, nome: 'P1', peso: 2,
                nota: 7, id_materia: 1, ativo: true},
            {id: 1, nome: 'Teste', peso: 2,
                nota: 7, id_materia: 1, ativo: true}
        ]);

    });

    it('BDD - Cenário: Desconsiderar atividade do cálculo ' +
        'Dado que: o usuário desativou o chackbox de uma atividade ' +
        'Então: a atividade será desconsiderada do cálculo da média ' +
        'E: a ação será gravada no banco de dados', function(){
        expect($scope.changeShowActivity).toBeDefined();
        spyOn(serviceDashBoard, 'changeShowActivity').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {
                        rowsAffected: 1
                    };
                    return callback(result);
                }
            }
        });
        spyOn(serviceDashBoard, 'calcAverage').and.callThrough();
        $scope.data.listActivities = [
            {id: 1, nome: 'P1', peso: 2,
                nota: 7, id_materia: 1, ativo: true},
            {id: 1, nome: 'Teste', peso: 2,
                nota: 7, id_materia: 1, ativo: true}
        ];
        data = {
            id: 1, nome: 'P1', peso: 2,
            nota: 7, id_materia: 1, ativo: true
        };
        $scope.changeShowActivity(data);
        expect(serviceDashBoard.changeShowActivity).toHaveBeenCalledWith(data);
        expect(serviceDashBoard.calcAverage).toHaveBeenCalledWith([
            {id: 1, nome: 'P1', peso: 2,
                nota: 7, id_materia: 1, ativo: true},
            {id: 1, nome: 'Teste', peso: 2,
                nota: 7, id_materia: 1, ativo: true}
        ]);

    });

    it('BDD - Cenário: Atualização do cálculo da média ' +
        'Dado que: o usuário fez uma simulação alterando o campo peso e/ou nota ' +
        'Então: a média será calculada novamente', function(){
        expect($scope.refreshAverage).toBeDefined();
        spyOn(serviceDashBoard, 'calcAverage').and.callThrough();
        $scope.data.listActivities = [
            {id: 1, nome: 'P1', peso: 2,
                nota: 7, id_materia: 1, ativo: true},
            {id: 1, nome: 'Teste', peso: 2,
                nota: 7, id_materia: 1, ativo: true}
        ];
        $scope.refreshAverage();
        expect(serviceDashBoard.calcAverage).toHaveBeenCalled();
    });

    it('BDD - Cenário: Alteração da cor do texto da média ' +
        'Dado que: a média é maior ou igual a média mínima ' +
        'definida na sessão de configurações ' +
        'Então: a cor do texto será verde', function(){
        expect($scope.statusAverage).toBeDefined();
        spyOn(serviceConfig, 'getObjNotes').and.callFake(function(){
           return {
               intervalo_de: 0,
               intervalo_para: 10,
               media_minima: 7
           }
        });
        $scope.statusAverage();
        expect(serviceConfig.getObjNotes).toHaveBeenCalled();
    });

    it('BDD - Cenário: Alteração da cor do texto da quantidade de faltas ' +
        'Dado que: a qunatidade de faltas atingiu 75% do máximo ' +
        'Então: a cor do texto será vermelho', function(){
        expect($scope.statusAttendance).toBeDefined();
        $scope.data.subject = {
            num_faltas: 15,
            max_faltas: 20
        };
        $scope.statusAttendance();
        expect($scope.data.statusAttendance).toEqual(true);
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

    it('BDD - Cenário: Gravação das manipulações realizadas na área de controle ' +
        'Dado que: o usuário confirmou a gravação das alterações na caixa de diálogo ' +
        'Então: as alterações serão gravadas no banco de dados', function(){
        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return {
                then: function(callBack){
                    return callBack(1);
                }
            }
        });

        spyOn(serviceDashBoard, 'multipleUpdate').and.callThrough();

        $scope.data.manipulate = true;
        $scope.data.listActivities = [{id: 1, nome: 'Prova 1', peso: 3, nota: 7, id_materia: 2, tipo: 'prova', ativo: true},
            {id: 2, nome: 'Exercicios Teste', peso: 3, nota: 10, id_materia: 1, tipo: 'trabalho', ativo: true}];

        $scope.finishDashBoard();
        expect($scope.finishDashBoard).toBeDefined();
        expect(serviceDashBoard.multipleUpdate).toHaveBeenCalled();

    });
});


