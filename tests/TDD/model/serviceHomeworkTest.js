/**
 * Created by everton on 11/08/15.
 */
describe('Service Homework Test', function(){
    var serviceHomework, factoryDatabase, $cordovaSQLite, $scope;

    beforeEach(module('anotei'));

    beforeEach(inject(function($injector, $httpBackend){
        serviceHomework = $injector.get('serviceHomework');
        factoryDatabase = $injector.get('factoryDatabase');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        var rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        $scope = rootScope.$new();

    }));


    it('TDD - Should verify if the service and methods exists', function(){
        expect(serviceHomework).toBeDefined();
        expect(serviceHomework.getHomeworks).toBeDefined();
        expect(serviceHomework.insertHomework).toBeDefined();
        expect(serviceHomework.updateHomework).toBeDefined();
        expect(serviceHomework.deleteHomework).toBeDefined();
    });
    //GET Homework
    it('TDD - Should verify if the method getHomeworks will ' +
        'get a list of Homeworks', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            trabalho: 'P1',
                            data_entrega: '2015-10-10',
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
        debugger;
        var resp = serviceHomework.getHomeworks();
        resp.then(succesSpy, failSpy);

        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith([
            {id: 1,
                trabalho: 'P1',
                data_entrega: new Date('2015-10-10'),
                observacoes: 'nothing',
                peso: 2,
                nota: 7,
                id_materia: 1,
                nome: 'Matemática'
            }]
        );
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method getHomeworks will call the factory ' +
        'with the correct query', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceHomework.getHomeworks('asc');
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select t.id, t.trabalho, t.data_entrega, t.observacoes, t.peso, t.nota,t.id_materia, m.nome '+
            'from trabalhos as t inner join materias as m on t.id_materia = m.id ' +
            'group by m.nome, t.trabalho order by nome asc');
    });

    it('TDD - Should verify if the method getHomeworks will call the factory ' +
        'with the correct query with order by DESC', function(){
        spyOn(factoryDatabase, 'executeQuery').and.callFake(function(){
            return{
                then: function(callback){

                }
            };
        });

        serviceHomework.getHomeworks('desc');
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith('select t.id, t.trabalho, t.data_entrega, t.observacoes, t.peso, t.nota,t.id_materia, m.nome '+
            'from trabalhos as t inner join materias as m on t.id_materia = m.id ' +
            'group by m.nome, t.trabalho order by nome desc');
    });

    //INSERT Homework
    it('TDD - Should verify if the method insertHomework is able ' +
        'to insert a new Homework', function(){
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
            trabalho: 'Trabalho 1',
            data_entrega: '2015-10-04',
            observacoes: 'nothing',
            peso: null,
            nota: null,
            id_materia: 1
        };

        var resp = serviceHomework.insertHomework(data);
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
            trabalho: 'Trabalho 1',
            data_entrega: '2015-10-04',
            observacoes: 'nothing',
            peso: 0,
            nota: 0,
            id_materia: 1
        };

        serviceHomework.insertHomework(data);
        $scope.$apply();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith(
            'insert into trabalhos ' +
            '(trabalho, data_entrega, observacoes, peso, nota, id_materia) ' +
            'values (?, ?, ?, ?, ?, ?)', [data.trabalho, data.data_entrega, data.observacoes,
                0, 0, data.id_materia]);
    });

    it('TDD - Should verify if the method insertHomework' +
        'will validate the data sent by the caller and return correctly', function(){

        var succesSpy = jasmine.createSpy('success'),
            failSpy   = jasmine.createSpy('failure');

        var data = {
            trabalho: null,
            data_entrega: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1
        };

        var resp = serviceHomework.insertHomework(data);
        resp.then(succesSpy, failSpy);
        $scope.$apply();
        expect(succesSpy).toHaveBeenCalledWith(1);

    });

    //UPDATE Homework
    it('TDD - Should verify if the method updateHomework ' +
        'is able to update an Homework', function(){
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
            trabalho: 'Trabalho 4',
            data_entrega: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1,
            id: 7
        };

        var resp = serviceHomework.updateHomework(data);
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
            trabalho: 'Trabalho 4',
            data_entrega: '2015-10-04',
            observacoes: 'nothing',
            peso: 2,
            nota: 10,
            id_materia: 1,
            id: 7
        };

        var resp = serviceHomework.updateHomework(data);
        resp.then(succesSpy, failSpy);

        $scope.$apply();
        expect(succesSpy).toHaveBeenCalled();
        expect(factoryDatabase.executeQuery).toHaveBeenCalledWith(
            'update trabalhos set ' +
            'trabalho = ?, data_entrega = ?, observacoes = ?, ' +
            'peso = ?, nota = ?, id_materia = ? where id = ?',
            [ 'Trabalho 4', '2015-10-04', 'nothing', 2, 10, 1, 7 ]
        );
    });

    it('TDD - Should verify if the method deleteHomework is ' +
        'able to delete some chosen Homework', function(){

        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
           return{
               then: function(callBack){
                   return callBack();
               }
           }
        });

        var successSpy = jasmine.createSpy('success'),
            failSpy = jasmine.createSpy('failure');

        serviceHomework.deleteHomework(1).then(successSpy, failSpy);
        $scope.$apply();

        expect(successSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
    });

    it('TDD - Should verify if the method deleteHomework is ' +
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

        serviceHomework.deleteHomework(1).then(successSpy, failSpy);
        $scope.$apply();

        expect(successSpy).not.toHaveBeenCalled();
        expect(failSpy).toHaveBeenCalled();
    })

});