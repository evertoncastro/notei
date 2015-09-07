/**
 * Created by everton on 07/09/15.
 */
describe('Service DashBoard Test', function(){
    var serviceExam, factoryDatabase, $scope, serviceDashBoard,
        $cordovaSQLite;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceExam = $injector.get('serviceExam');
        factoryDatabase = $injector.get('factoryDatabase');
        serviceDashBoard = $injector.get('serviceDashBoard');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));


    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceDashBoard).toBeDefined();
        expect(serviceDashBoard.getListExams).toBeDefined();
        expect(serviceDashBoard.getListHomework).toBeDefined();
    });

    it('TDD - Should verify if the method getListExams loads a list ' +
        'from the database based on a specific subject', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            titulo: 'P1',
                            peso: 2,
                            nota: 7,
                            id_materia: 1,
                            ativo: 1
                        }
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };
                    return callback(result);
                }
            };
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        serviceDashBoard.getListExams(1).then(
            successSpy, failSpy
        );

        $scope.$apply();

        expect(successSpy).toHaveBeenCalledWith([{
                id: 1,
                titulo: 'P1',
                peso: 2,
                nota: 7,
                id_materia: 1,
                ativo: 1
            }]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method getListHomework loads a list ' +
        'from the database based on a specific subject', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            trabalho: 'Teste',
                            peso: 2,
                            nota: 7,
                            id_materia: 1,
                            ativo: 1
                        }];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };
                    return callback(result);
                }
            };
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        serviceDashBoard.getListHomework(1).then(
            successSpy, failSpy
        );

        $scope.$apply();

        expect(successSpy).toHaveBeenCalledWith([{
                id: 1,
                trabalho: 'Teste',
                peso: 2,
                nota: 7,
                id_materia: 1,
                ativo: 1
            }]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });
});