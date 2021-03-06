/**
 * Created by everton on 11/08/15.
 */
describe('Service Exam Test', function(){
    var serviceExam, factoryDatabase, $cordovaSQLite, $scope,
        $state, $cordovaDialogs, serviceConstants;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceExam = $injector.get('serviceExam');
        factoryDatabase = $injector.get('factoryDatabase');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        $state = $injector.get('$state');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceConstants = $injector.get('serviceConstants');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

        spyOn($state, 'go');
        spyOn($cordovaDialogs, 'alert');
    }));


    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceExam).toBeDefined();
        expect(serviceExam.getExams).toBeDefined();
        expect(serviceExam.insertExam).toBeDefined();
        expect(serviceExam.updateExam).toBeDefined();
        expect(serviceExam.deleteExam).toBeDefined();
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
                            id_materia: 1,
                            nome: 'Matemática'
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
        var resp = serviceExam.getExams();
        resp.then(succesSpy, failSpy);

        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith([
            {id: 1,
                titulo: 'P1',
                data: new Date('2015-10-10'),
                observacoes: 'nothing',
                peso: 2,
                nota: 7,
                id_materia: 1,
                nome: 'Matemática'
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

        serviceExam.getExams('asc');
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select ' +
            'p.id, p.titulo, p.data, p.observacoes, p.peso, p.nota, p.id_materia, m.nome ' +
            'from provas as p inner join materias as m ' +
            'on p.id_materia = m.id group by m.nome, p.titulo order by nome asc');
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

    //INSERT EXAM
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
            peso: null,
            nota: null,
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
            peso: 0,
            nota: 0,
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

    it('TDD - Should verify if the method insertExam' +
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

    //UPDATE EXAM
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
            id_materia: 1,
            id: 7
        };

        var resp = serviceExam.updateExam(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();

        expect(succesSpy).toHaveBeenCalled();
    });

    it('TDD - Should verify if the method updateExam ' +
        'calls the factory with the correctly query ', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    return callback();
                }
            };
        });

        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
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
            id_materia: 1,
            id: 7
        };

        var resp = serviceExam.updateExam(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();
        expect(succesSpy).toHaveBeenCalled();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith(
            'update provas set ' +
            'titulo = ?, data = ?, ' +
            'observacoes = ?, peso = ?, ' +
            'nota = ?, id_materia = ? where id = ?',
            [ 'Prova 4', '2015-10-04', 'nothing', 2, 10, 1, 7 ]
        );
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
    });

    it('TDD - should redirect user to app.homework-new when there is ' +
        'at least one item in list', function(){
        expect(serviceExam.verifySubjectExistence).toBeDefined();
        var list = [{}];
        serviceExam.verifySubjectExistence(list);
        expect($state.go).toHaveBeenCalledWith('app.exam-new');
    });

    it('TDD - should raise an alert when there is no item in list', function(){
        expect(serviceExam.verifySubjectExistence).toBeDefined();
        var list = [];
        serviceExam.verifySubjectExistence(list);
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_NOT_ALLOW_CREATE_EXAM.MSG,
            serviceConstants.MSG_NOT_ALLOW_CREATE_EXAM.ALERT,
            serviceConstants.MSG_NOT_ALLOW_CREATE_EXAM.BUTTON);
    })

});