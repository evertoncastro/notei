/**
 * Created by everton on 06/08/15.
 */
describe('Área de anotação controller', function () {

    var DashBoardCtrl, $scope, serviceSubject, $cordovaSQLite,
        $cordovaDialogs, serviceConstants, serviceDashBoard,
        serviceConfig, serviceValidation;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        serviceConstants = $injector.get('serviceConstants');
        $cordovaSQLite = $injector.get('$cordovaSQLite');
        serviceDashBoard = $injector.get('serviceDashBoard');
        $cordovaDialogs = $injector.get('$cordovaDialogs');
        serviceConfig = $injector.get('serviceConfig');
        serviceValidation = $injector.get('serviceValidation');

        $httpBackend.whenGET(/templates\/.*/).respond(200);
        spyOn($cordovaDialogs, 'alert');

        spyOn($cordovaSQLite, 'execute') .and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id: 1,
                            nome: 'Matemática',
                            max_faltas: 20,
                            professor: 'Everton de Castro',
                            email_prof: 'evertoncastro.sp@gmail.com',
                            num_faltas: 5}
                    ];

                    result.rows.item = function (index){
                        return result.rows[index];
                    };


                    return callback(result);
                }
            };
        });

        var Modal = function() {void(0);};
        Modal.prototype.show = function() {void(0);};
        Modal.prototype.hide = function() {void(0);};
        $scope.modal = new Modal();


        DashBoardCtrl = $controller('DashBoardCtrl', {'$scope': $scope});


    }));

    it('TDD - Should define SubjectNewCtrl', function(){
        expect(DashBoardCtrl).toBeDefined();
    });

    it('TDD - Should change the status for $scope.manipulate', function(){
        expect($scope.activeManipulate).toBeDefined();
        $scope.activeManipulate();

        expect($scope.data.manipulate).toBe(true);
    });

    it('TDD - Should define setOldValue', function(){
        expect($scope.setOldValue).toBeDefined();
    });

});


