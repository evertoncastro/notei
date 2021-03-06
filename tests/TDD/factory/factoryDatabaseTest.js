/**
 * Created by everton on 27/07/15.
 */
describe('Database - factory test', function(){

    var factoryDatabase, $cordovaSQLite;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector){
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        factoryDatabase = $injector.get('factoryDatabase');
        $ionicLoading = $injector.get('$ionicLoading');

        window.cordova = { mocked: true };
        window.sqlitePlugin = {
            openDatabase: angular.noop,
            deleteDatabase: angular.noop,
            transaction: angular.noop
        };

        spyOn(sqlitePlugin, 'openDatabase').and.callFake(function(){
           return {};
        });

    }));

    it('TDD - verify all the definitions', function(){
       expect(factoryDatabase).toBeDefined();
       expect(factoryDatabase.init).toBeDefined();
        expect(factoryDatabase.executeQuery).toBeDefined();
    });

    it('TDD - should verify the start of database', function(){
        expect(factoryDatabase.init()).toBeDefined;
        expect(window.sqlitePlugin.openDatabase).toHaveBeenCalled();
    });

    it('TDD - should verify if the method execute were called correctly' +
        'show and hide the loading', function(){
        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
           return{
             then: function(call){
                 call();
             }
           };
        });

        var deliveredQuery = 'insert into provas ' +
            '(descricao, data, observacoes, peso, nota, id_materia) ' +
            'values (?, ?, ?, ?, ?, ?)';
        var fields = ['Prova 1', '09-10-2015', null, 3.5, null, 1];

        var resp = factoryDatabase.executeQuery(deliveredQuery, fields);
        expect($cordovaSQLite.execute).toHaveBeenCalledWith(undefined, deliveredQuery, fields);
        expect(resp).not.toBeUndefined();
    });

});
