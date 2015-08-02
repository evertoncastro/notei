/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceSubject', function($q, factoryDatabase){

    return{
        getSubjects: function(){
            var defer = $q.defer();

            var resp = factoryDatabase.executeQuery('select * from materias');

            resp.then(
                function(resultSet){
                    var listMateria = [];

                    for(var i = 0; i < resultSet.rows.length; i++){
                        var materia = {};

                        materia.id_materia = resultSet.rows.item(i).id_materia;
                        materia.nome = resultSet.rows.item(i).nome;
                        materia.max_faltas = resultSet.rows.item(i).max_faltas;
                        materia.professor = resultSet.rows.item(i).professor;
                        materia.email_prof = resultSet.rows.item(i).email_prof;
                        materia.num_faltas = resultSet.rows.item(i).num_faltas;

                        listMateria.push(materia);
                    }
                    defer.resolve(listMateria);
                },
                function(error){
                    console.log(error);
                }
            );

            return defer.promise;
        }
    }

});