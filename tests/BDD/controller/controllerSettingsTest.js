/**
 * Created by everton on 06/08/15.
 */
describe('Configurações', function () {

    var SettingsCtrl, $scope, serviceSubject,
        $cordovaDialogs, serviceConstants, serviceConfig;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        serviceConstants = $injector.get('serviceConstants');
        serviceConfig = $injector.get('serviceConfig');
        $cordovaDialogs = $injector.get('$cordovaDialogs');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');

        spyOn(serviceConfig, 'getConfigNotes').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {
                        id: 1,
                        intervalo_de: 0,
                        intervalo_para: 10,
                        media_minima: 7
                    };
                    return callback(result);
                }
            }
        });

        SettingsCtrl = function(){
            return $controller('SettingsCtrl', {'$scope': $scope});
        };
    }));

    it('BDD - Cenário: Carregamento dos itens de configuração ' +
        'Dado que: o usuário entrou na tela de configurações ' +
        'Então: todos os itens de configuração serão exibidos na tela' ,function(){

        expect(SettingsCtrl).toBeDefined();
        SettingsCtrl();
        $scope.$apply();

        expect($scope.configNotes).toEqual({
            id: 1,
            intervalo_de: 0,
            intervalo_para: 10,
            media_minima: 7
        });

    });

    it('BDD - Cenário: Alteração dos itens de configuração de Notas ' +
        'Dado que: o usuário alterou qualquer valor no intervalo de Notas ' +
        'ou em Media mínima ' +
        'Então: o valor será alterado no banco de dados' ,function(){

        spyOn(serviceConfig, 'updateConfigNotes').and.callFake(function(){
            return{
                then: function(callback){
                    var result = {
                        rowsAffected: 1
                    };
                    return callback(result);
                }
            }
        });

        SettingsCtrl();
        var data = {
            id: 1,
            intervalo_de: 0,
            intervalo_para: 10,
            media_minima: 7
        };
        $scope.updateConfigNotes(data);
        $scope.$apply();

        expect(serviceConfig.updateConfigNotes).toHaveBeenCalledWith({
            id: 1,
            intervalo_de: 0,
            intervalo_para: 10,
            media_minima: 7
        });

    });

    it('BDD - Cenário: Alteração dos itens de configuração de Notas ' +
        'Dado que: o usuário alterou qualquer um dos campos para nulo ' +
        'Então: uma mensagem será exibida informando que ' +
        'nenhum campo pode ser nulo' ,function(){

        spyOn(serviceConfig, 'updateConfigNotes').and.callThrough();

        SettingsCtrl();
        var data = {
            id: 1,
            intervalo_de: null,
            intervalo_para: 10,
            media_minima: 7
        };
        $scope.updateConfigNotes(data);
        $scope.$apply();

        expect(serviceConfig.updateConfigNotes).toHaveBeenCalled();
        expect($cordovaDialogs.alert).toHaveBeenCalledWith(
            serviceConstants.MSG_EMPTY_CONFIG_NOTES.MSG,
            serviceConstants.MSG_EMPTY_CONFIG_NOTES.ALERT,
            serviceConstants.MSG_EMPTY_CONFIG_NOTES.BUTTON
        );

    });

});


