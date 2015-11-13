/**
 * Created by everton on 30/07/15.
 */
describe('Service Subject Test', function(){
    var serviceSubject, factoryDatabase, $cordovaSQLite, $scope;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceSubject = $injector.get('serviceSubject');
        factoryDatabase = $injector.get('factoryDatabase');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));


    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceSubject).toBeDefined();
        expect(serviceSubject.getSubjects).toBeDefined();
        expect(serviceSubject.insertSubject).toBeDefined();
        expect(serviceSubject.updateSubject).toBeDefined();
        expect(serviceSubject.deleteSubject).toBeDefined();
    });
    //GET SUBJECT
    it('TDD - Should verify if the method getSubjects will ' +
        'get a list of subjects', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            nome: 'Matemática',
                            max_faltas: 20,
                            professor: 'Silva',
                            email_prof: 'silva@gmail.com',
                            num_faltas: 5
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

        var resp = serviceSubject.getSubjects();
        resp.then(succesSpy, failSpy);

        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith([
            {id: 1,
                nome: 'Matemática',
                max_faltas: 20,
                professor: 'Silva',
                email_prof: 'silva@gmail.com',
                num_faltas: 5
            }]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method getSubject will call the factory ' +
        'with select * from materias', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceSubject.getSubjects();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select * from materias');
    });

    it('TDD - Should verify if the method getSubject will call the factory ' +
        'with select * from materias order by nome ASC', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceSubject.getSubjects('asc');
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select * from materias order by nome ASC');
    });


    it('TDD - Should verify if the method getSubject will call the factory ' +
        'with select * from materias order by nome DESC', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceSubject.getSubjects('desc');
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select * from materias order by nome DESC');
    });

    //INSERT SUBJECT
    it('TDD - Should verify if the method insertSubject is able ' +
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
    });

    it('TDD - Should verify if the method inserSubjects' +
        'will validate the data sent by the caller and return correctly', function(){

        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');

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

    });

    //UPDATE SUBJECT
    it('TDD - Should verify if the method updateSubject ' +
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
    });

    it('TDD - Should verify if the method deleteSubject is ' +
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


    it('TDD - Should verify if the method deleteSubject is ' +
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
    })

});