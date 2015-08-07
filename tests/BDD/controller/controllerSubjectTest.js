/**
 * Created by everton on 06/08/15.
 */
describe('Subject controller', function () {

    var SubjectCtrl, $scope, serviceSubject, $cordovaSQLite;

    beforeEach(module('anotei'));

    beforeEach(inject(function ($injector, $controller, $httpBackend) {
        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        serviceSubject = $injector.get('serviceSubject');
        $cordovaSQLite = $injector.get('$cordovaSQLite');

        $httpBackend.whenGET(/templates\/.*/).respond(200);

        spyOn($cordovaSQLite, 'execute') .and.callFake(function(){
            return{
                then: function(callback){
                    var result = {};
                    result.rows = [
                        {id_materia: 1,
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

        SubjectCtrl = $controller('SubjectCtrl', {'$scope': $scope});

    }));

    it('TDD - Should define SubjectNewCtrl', function(){
       expect(SubjectCtrl).toBeDefined();
    });

    it('BDD - Cenário: Exibição das matérias na tela ' +
        'Dado que: o usuário entrou na tela Matérias ' +
        'Então: a matéria Matemática será exibida na tela', function(){

        $scope.$apply();

        expect($scope.data.subjectList).toEqual([
            {id_materia: 1,
                nome: 'Matemática',
                max_faltas: 20,
                professor: 'Everton de Castro',
                email_prof: 'evertoncastro.sp@gmail.com',
                num_faltas: 5}
        ]);
    });

    it('', function(){

    })
});


