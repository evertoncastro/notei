/**
 * Created by evertondecastro on 6/11/15.
 */
describe('Lista Produto', function () {

    var serviceProductListDB, $scope, $cordovaSQLite;
    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $httpBackend){
        serviceProductListDB = $injector.get('serviceProductListDB');
        var rootScope = $injector.get('$rootScope');
        $cordovaSQLite = $injector.get('$cordovaSQLite');

        $httpBackend.whenGET(/templates\/.*/).respond(200);

        $scope = rootScope.$new();

        spyOn($cordovaSQLite, 'execute').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {cod_prod: 1,
                            codigo: '16 004016', nome: 'Bar Meia Lua Ratan', cod_cat: 1,
                            foto: 'b_7.jpg', foto_64: '01', descricao: 'teste',
                            info_adicionais: 'teste', metros_tecido: 'teste', largura: 2.8,
                            altura: 0.95, profundidade: 0.55, diametro: 0, suspenso: 0, idCarrinho: 1}
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };


                    return callback(result);
                }
            };
        });

    }));

    it('TDD - Should execute method getProductListNext', function(){
        expect(serviceProductListDB.getProductListNext).toBeDefined();
        //debugger;
        var successSpy = jasmine.createSpy('success'),
            failSpy    = jasmine.createSpy('failure');

        var sentInformation = {
            cat: 1,
            nome: undefined
        };

        var resp = serviceProductListDB.getProductListNext(sentInformation);

        resp.then(successSpy, failSpy);

        $scope.$apply();

        expect(failSpy).not.toHaveBeenCalled();

        expect(successSpy).toHaveBeenCalledWith([
            {cod_prod: 1, codigo: '16 004016', nome: 'Bar Meia Lua Ratan',
                cod_cat: 1, foto: 'b_7.jpg', foto_64: '01', descricao: 'teste',
                info_adicionais: 'teste', metros_tecido: 'teste', largura: 2.8,
                altura: 0.95, profundidade: 0.55, diametro: 0, suspenso: 0, idCarrinho: 1}
        ]);
    });

});
