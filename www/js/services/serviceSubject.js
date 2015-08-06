/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceSubject', function($q, factoryDatabase, serviceUtil){

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
        },

        insertSubject: function(data){
            var defer = $q.defer();
            var validator = 0;
            if(serviceUtil.isEmpty(data.nome)){validator = 1}
            else if(serviceUtil.isEmpty(data.max_faltas)){validator = 1}
            else if(serviceUtil.isEmpty(data.professor)){validator = 1}

            if(validator==1){
                defer.resolve(1);
            }else{
                var sqlQuery = 'insert into materias ' +
                    '(nome, max_faltas, professor, email_prof, num_faltas) ' +
                    'values (?, ?, ?, ?, ?)';
                var param = [data.nome, data.max_faltas, data.professor,
                    data.email_prof, 0];
                var resp = factoryDatabase.executeQuery(sqlQuery, param);
                resp.then(
                    function(result){
                        defer.resolve(2);
                    },

                    function(error){
                        defer.reject(error);
                    }
                );
            }
            return defer.promise;
        }
    }

});