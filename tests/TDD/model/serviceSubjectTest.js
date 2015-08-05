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
    });

    it('TDD - Should verify if the method getSubjects will ' +
        'get a list of subjects', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id_materia: 1,
                            nome: 'Matemática',
                            max_faltas: 20,
                            professor: 'Silva',
                            email_prof: 'silva@gmail.com',
                            num_faltas: null}
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };


                    return callback(result);
                }
            };
        });
        debugger;
        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');

        var resp = serviceSubject.getSubjects();
        resp.then(succesSpy, failSpy);

        $scope.$apply();

        expect(succesSpy).toHaveBeenCalledWith([
            {id_materia: 1,
                nome: 'Matemática',
                max_faltas: 20,
                professor: 'Silva',
                email_prof: 'silva@gmail.com',
                num_faltas: null}]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

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
            email_prof: 'evertoncastro.sp@gmail.com',
            num_faltas: 0
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
            email_prof: 'evertoncastro.sp@gmail.com',
            num_faltas: 0
        };
        serviceSubject.insertSubject(data);
        $scope.$apply();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith(
            'insert into materias (nome, max_faltas, professor, email_prof, num_faltas) ' +
            'values (?, ?, ?, ?, ?)', ['Programação 2',
            20, 'Everton de Castro', 'evertoncastro.sp@gmail.com', 0]);
    });
});