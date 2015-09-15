/**
 * Created by everton on 7/09/15.
 */
describe('Service DashBoard Test', function(){
    var serviceExam, factoryDatabase, $scope, serviceDashBoard,
        $cordovaSQLite, serviceConfig, serviceHomework, $cordovaDialogs;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceExam = $injector.get('serviceExam');
        factoryDatabase = $injector.get('factoryDatabase');
        serviceDashBoard = $injector.get('serviceDashBoard');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        serviceConfig = $injector.get('serviceConfig');
        serviceHomework = $injector.get('serviceHomework');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));


    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceDashBoard).toBeDefined();
        expect(serviceDashBoard.getListExams).toBeDefined();
        expect(serviceDashBoard.getListHomework).toBeDefined();
        expect(serviceDashBoard.mountList).toBeDefined();
        expect(serviceDashBoard.calcAverage).toBeDefined();
        expect(serviceDashBoard.changeShowActivity).toBeDefined();
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
                            data: 'Sat Sep 12 2015 12:20:04 GMT-0300 (BRT)',
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
                nome: 'P1',
                data: new Date('Sat Sep 12 2015 12:20:04 GMT-0300 (BRT)'),
                peso: 2,
                nota: 7,
                id_materia: 1,
                tipo: 'prova',
                ativo: true
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
                            data_entrega: 'Sat Sep 12 2015 12:20:04 GMT-0300 (BRT)',
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
                nome: 'Teste',
                data_entrega: new Date('Sat Sep 12 2015 12:20:04 GMT-0300 (BRT)'),
                peso: 2,
                nota: 7,
                id_materia: 1,
                tipo: 'trabalho',
                ativo: true
            }]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method mountList is able to concat ' +
        'exam and homework lists' ,function(){
        spyOn(serviceDashBoard, 'getListExams').and.callFake(function(){
            return{
                then: function(callback){
                    var result = [
                        {id: 1,
                            nome: 'P1',
                            peso: 2,
                            nota: 7,
                            id_materia: 1,
                            tipo: 'prova',
                            ativo: true
                        }
                    ];
                    return callback(result);
                }
            };
        });

        spyOn(serviceDashBoard, 'getListHomework').and.callFake(function(){
            return{
                then: function(callback){
                    var result = [
                        {id: 1,
                            nome: 'Teste',
                            peso: 2,
                            nota: 7,
                            id_materia: 1,
                            tipo: 'trabalho',
                            ativo: true
                        }];
                    return callback(result);
                }
            };
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        serviceDashBoard.mountList(1).then(
            successSpy, failSpy
        );
        $scope.$apply();

        expect(successSpy).toHaveBeenCalledWith([
            {id: 1,
                nome: 'P1',
                peso: 2,
                nota: 7,
                id_materia: 1,
                tipo: 'prova',
                ativo: true
            },
            {id: 1,
                nome: 'Teste',
                peso: 2,
                nota: 7,
                id_materia: 1,
                tipo: 'trabalho',
                ativo: true
            }
        ]);
        expect(failSpy).not.toHaveBeenCalled();
        expect(serviceDashBoard.getListExams).toHaveBeenCalled();
        expect(serviceDashBoard.getListHomework).toHaveBeenCalled();
    });

    it('TDD - Should verify if the method calcAverage returns a ' +
        'calculated average from a list of activities', function(){
        spyOn(serviceConfig, 'getObjNotes').and.callFake(function(){
           return {
               intervalo_de: 0,
               intervalo_para: 10,
               media_minima: 7
           };
        });

        var activities = [
            {id: 1, nome: 'P1', peso: 3.5, nota: 7, id_materia: 1, ativo: true},
            {id: 2, nome: 'P2', peso: 4.5, nota: 4, id_materia: 1, ativo: false},
            {id: 3, nome: 'P3', peso: 4.5, nota: 7, id_materia: 1, ativo: true},
            {id: 5, nome: 'Trabalho 1', peso: 1, nota: 7, id_materia: 1, ativo: true},
            {id: 6, nome: 'Trabalho 2', peso: 1, nota: 9, id_materia: 1, ativo: true}];

        var average = serviceDashBoard.calcAverage(activities);

        expect(average).toEqual((7.2).toFixed(2));
    });

    it('TDD - Should update the field ativo in table provas or ' +
        'trabalhos', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {
                       rowsAffected: 1
                    };
                    return callback(result);
                }
            }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        data = {
            id: 1, nome: 'P1', peso: 2, nota: 7,
            id_materia: 1, tipo: 'prova', ativo: true
        };

        serviceDashBoard.changeShowActivity(data).then(
            successSpy, failSpy
        );
        $scope.$apply();
        expect(successSpy).toHaveBeenCalledWith({
            rowsAffected: 1
        });
        expect(failSpy).not.toHaveBeenCalled();

    });

    it('TDD - Should update all exams and homeworks in the same ' +
        'time for a subject', function(){
        spyOn($cordovaDialogs, 'confirm').and.callFake(function(){
            return {
                then: function(callback){
                    return callback(1);
                }
            }
        });

        spyOn(serviceExam, 'updateExam').and.callFake(function(){
            return {
                then: function(callback){
                    return callback();
                }
            }
        });

        spyOn(serviceHomework, 'updateHomework').and.callFake(function(){
            return {
                then: function(callback){
                    return callback();
                }
            }
        });


        expect(serviceDashBoard.multipleUpdate).toBeDefined();
        var listActivities = [{id: 1, nome: 'Prova 1', peso: 3, nota: 7, id_materia: 2, tipo: 'prova', ativo: true},
                         {id: 2, nome: 'Exercicios Teste', peso: 3, nota: 10, id_materia: 1, tipo: 'trabalho', ativo: true}];

        serviceDashBoard.multipleUpdate(listActivities);
        $scope.$apply();
        expect(serviceExam.updateExam).toHaveBeenCalledWith(
            {id: 1, nome: 'Prova 1', peso: 3, nota: 7, id_materia: 2, tipo: 'prova', ativo: true, titulo: 'Prova 1'}
        );
        expect(serviceHomework.updateHomework).toHaveBeenCalledWith(
            {id: 2, nome: 'Exercicios Teste', peso: 3, nota: 10, id_materia: 1, tipo: 'trabalho', ativo: true, trabalho: 'Exercicios Teste'}
        );
    });

});