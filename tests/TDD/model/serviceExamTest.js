/**
 * Created by everton on 11/08/15.
 */
describe('Service Exam Test', function(){
    var serviceExam, factoryDatabase, $cordovaSQLite, $scope;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceExam = $injector.get('serviceExam');
        factoryDatabase = $injector.get('factoryDatabase');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));


    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceExam).toBeDefined();
        //expect(serviceSubject.getSubjects).toBeDefined();
        //expect(serviceSubject.insertSubject).toBeDefined();
        //expect(serviceSubject.updateSubject).toBeDefined();
        //expect(serviceSubject.deleteSubject).toBeDefined();
    });
    //GET EXAM
    it('TDD - Should verify if the method getExams will ' +
        'get a list of exams', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            titulo: 'P1',
                            data: '2015-10-10',
                            observacoes: 'nothing',
                            peso: 2,
                            nota: 7,
                            id_materia: 1
                        }
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };


                    return callback(result);
                }
            };
        });
        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');
        debugger;
        var resp = serviceExam.getExams();
        resp.then(succesSpy, failSpy);

        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith([
            {id: 1,
                titulo: 'P1',
                data: new Date('2015-10-11'),
                observacoes: 'nothing',
                peso: 2,
                nota: 7,
                id_materia: 1
            }]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method getExams will call the factory ' +
        'with the correct query', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceExam.getExams();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select ' +
            'p.id, p.titulo, p.data, p.observacoes, p.peso, p.nota, p.id_materia, m.nome ' +
            'from provas as p inner join materias as m ' +
            'on p.id_materia = m.id group by m.nome, p.titulo');
    });

    it('TDD - Should verify if the method getExams will call the factory ' +
        'with the correct query with order by DESC', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceExam.getExams('desc');
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select ' +
            'p.id, p.titulo, p.data, p.observacoes, p.peso, p.nota, p.id_materia, m.nome ' +
            'from provas as p inner join materias as m ' +
            'on p.id_materia = m.id group by m.nome, p.titulo ' +
            'order by nome desc');
    });

    //INSERT SUBJECT
    it('TDD - Should verify if the method insertExam is able ' +
        'to insert a new exam', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    var result = 1;

                    return callback(result);
                }
            };
        });

        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');

        var data = {
            titulo: 'Prova 1',
            data: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1
        };

        var resp = serviceExam.insertExam(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();

        expect(succesSpy).toHaveBeenCalledWith(2);
        expect(failSpy).not.toHaveBeenCalled();

    });

    it('TDD - Should verify if the factoryDatabase.executeQuery ' +
        'will be called with the correct query and params', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        var data = {
            titulo: 'Prova 1',
            data: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1
        };

        serviceExam.insertExam(data);
        $scope.$apply();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith(
            'insert into provas ' +
            '(titulo, data, observacoes, peso, nota, id_materia) ' +
            'values (?, ?, ?, ?, ?, ?)', [data.titulo, data.data, data.observacoes,
                data.peso, data.nota, data.id_materia]);
    });

    it('TDD - Should verify if the method inserExam' +
        'will validate the data sent by the caller and return correctly', function(){

        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');

        var data = {
            titulo: null,
            data: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1
        };

        var resp = serviceExam.insertExam(data);
        resp.then(succesSpy, failSpy);
        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith(1);

    });

    //UPDATE SUBJECT
    it('TDD - Should verify if the method updateExam ' +
        'is able to update an exam', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                   return callback();
                }
            };
        });

        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');

        var data = {
            titulo: 'Prova 4',
            data: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1
        };

        var resp = serviceExam.updateExam(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();

        expect(succesSpy).toHaveBeenCalled();
    });

    it('TDD - Should verify if the method deleteExam is ' +
        'able to delete some chosen exam', function(){

        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
           return{
               then: function(callBack){
                   return callBack();
               }
           }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy = jasmine.createSpy('failure');

        serviceExam.deleteExam(1).then(successSpy, failSpy);
        $scope.$apply();

        expect(successSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method deleteExam is ' +
        'able to identify an error after the execution', function(){

        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callBack, callFail){
                    return callFail();
                }
            }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy = jasmine.createSpy('failure');

        serviceExam.deleteExam(1).then(successSpy, failSpy);
        $scope.$apply();

        expect(successSpy).not.toHaveBeenCalled();
        expect(failSpy).toHaveBeenCalled();
    })

});