/**
 * Created by everton on 06/08/15.
 */
describe('Área de anotação controller', function () {

    var DashBoardCtrl, $scope, serviceSubject, $cordovaSQLite,
        $cordovaDialogs, serviceConstants;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
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


    /*it('BDD - Cenário: Ordenação da lista de matérias ' +
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
    });*/



});


