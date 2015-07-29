/**
 * Created by everton on 27/07/15.
 */
describe('Database - factory test', function(){

    var factoryDB, $cordovaSQLite;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector){
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        factoryDB = $injector.get('factoryDB');

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
       expect(factoryDB).toBeDefined();
       expect(factoryDB.init).toBeDefined();
    });

    it('TDD - should verify the start of database', function(){
        expect(factoryDB.init()).not.toBeUndefined;
        expect(window.sqlitePlugin.openDatabase).toHaveBeenCalled();
    });

});