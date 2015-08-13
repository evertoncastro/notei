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
                            data: 'Tue Aug 30 2015 00:00:00 GMT-0300 (BRT)',
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
                data: 'Tue Aug 30 2015 00:00:00 GMT-0300 (BRT)',
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
    /*it('TDD - Should verify if the method insertSubject is able ' +
        'to insert a new subject', function(){
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
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        var resp = serviceSubject.insertSubject(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();

        expect(succesSpy).toHaveBeenCalledWith(2);
        expect(failSpy).not.toHaveBeenCalled();

    });*/

    /*it('TDD - Should verify if the factoryDatabase.executeQuery ' +
        'will be called with the correct query and params', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        var data = {
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        serviceSubject.insertSubject(data);
        $scope.$apply();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith(
            'insert into materias (nome, max_faltas, professor, email_prof, num_faltas) ' +
            'values (?, ?, ?, ?, ?)', ['Programação 2',
            20, 'Everton de Castro', 'evertoncastro.sp@gmail.com', 0]);
    });*/

    /*it('TDD - Should verify if the method inserSubjects' +
        'will validate the data sent by the caller and return correctly', function(){

        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');
        debugger;
        var data = {
            nome: 'Programação 2',
            max_faltas: null,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        var resp = serviceSubject.insertSubject(data);
        resp.then(succesSpy, failSpy);
        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith(1);

    });*/

    //UPDATE SUBJECT
    /*it('TDD - Should verify if the method updateSubject ' +
        'is able to update a Subject', function(){
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
            nome: 'Programação 2',
            max_faltas: 20,
            professor: 'Everton de Castro',
            email_prof: 'evertoncastro.sp@gmail.com'
        };

        var resp = serviceSubject.updateSubject(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();

        expect(succesSpy).toHaveBeenCalled();
    });*/

    /*it('TDD - Should verify if the method deleteSubject is ' +
        'able to delete some chosen subject', function(){

        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
           return{
               then: function(callBack){
                   return callBack();
               }
           }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy = jasmine.createSpy('failure');

        serviceSubject.deleteSubject(1).then(successSpy, failSpy);
        $scope.$apply();

        expect(successSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
    });
*/

    /*it('TDD - Should verify if the method deleteSubject is ' +
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

        serviceSubject.deleteSubject(1).then(successSpy, failSpy);
        $scope.$apply();

        expect(successSpy).not.toHaveBeenCalled();
        expect(failSpy).toHaveBeenCalled();
    })*/

});