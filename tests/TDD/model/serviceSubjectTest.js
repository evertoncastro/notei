/**
 * Created by everton on 30/07/15.
 */
describe('Service Subject Test', function(){
    var serviceSubject, $cordovaSQLite, $scope;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceSubject = $injector.get('serviceSubject');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();


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

    }));

    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceSubject).toBeDefined();
        expect(serviceSubject.getSubjects).toBeDefined();
    });

    it('TDD - Should verify if the method getSubjects will ' +
        'get a list of subjects', function(){
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
});