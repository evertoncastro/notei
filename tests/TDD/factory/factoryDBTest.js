/**
 * Created by everton on 27/07/15.
 */
describe('Database - factory test', function(){

    var factoryDB, $cordovaSQLite, $ionicLoading;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector){
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        factoryDB = $injector.get('factoryDB');
        $ionicLoading = $injector.get('$ionicLoading');

        window.sqlitePlugin = {
            openDatabase: angular.noop,
            deleteDatabase: angular.noop,
            transaction: angular.noop
        };

        spyOn(sqlitePlugin, 'openDatabase').and.callFake(function(){
           return {};
        });

        spyOn($ionicLoading, 'show');
        spyOn($ionicLoading, 'hide');

    }));

    it('TDD - verify all the definitions', function(){
       expect(factoryDB).toBeDefined();
       expect(factoryDB.init).toBeDefined();
        expect(factoryDB.executeQuery).toBeDefined();
    });

    it('TDD - should verify the start of database', function(){
        expect(factoryDB.init()).not.toBeUndefined;
        expect(window.sqlitePlugin.openDatabase).toHaveBeenCalled();
    });

    it('TDD - should verify if the method execute were called correctly' +
        'show and hide the loading', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
           return{
             then: function(call, error){
                 call();
             }
           };
        });

        var deliveredQuery = 'insert into provas ' +
            '(descricao, data, observacoes, peso, nota, id_materia) ' +
            'values (?, ?, ?, ?, ?, ?)';
        var fields = ['Prova 1', '09-10-2015', null, 3.5, null, 1];

        var resp = factoryDB.executeQuery(deliveredQuery, fields);
        expect($ionicLoading.show).toHaveBeenCalled();
        expect($ionicLoading.hide).toHaveBeenCalled();
        expect($cordovaSQLite.execute).toHaveBeenCalledWith(undefined, deliveredQuery, fields);
        expect(resp).not.toBeUndefined();
    });

});