/**
 * Created by everton on 07/09/15.
 */
var app = angular.module('anotei');

app.service('serviceDashBoard', function($q, factoryDatabase){

    return{

        getListExams: function(id_materia){
            var defer = $q.defer();
            var sqlQuery = 'select * from provas where id_materia = ? order by titulo';
            var param = [id_materia];

            factoryDatabase.executeQuery(sqlQuery, param).then(
                function(resultSet){
                    var listProva = [];

                    for(var i = 0; i < resultSet.rows.length; i++){
                        var prova = {};
                        prova.id = resultSet.rows.item(i).id;
                        prova.nome = resultSet.rows.item(i).titulo;
                        prova.peso = resultSet.rows.item(i).peso;
                        prova.nota = resultSet.rows.item(i).nota;
                        prova.id_materia = resultSet.rows.item(i).id_materia;
                        prova.ativo = resultSet.rows.item(i).ativo;

                        listProva.push(prova);
                    }
                    defer.resolve(listProva);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        getListHomework: function(id_materia){
            var defer = $q.defer();
            var sqlQuery = 'select * from trabalhos where id_materia = ? order by trabalho';
            var param = [id_materia];

            factoryDatabase.executeQuery(sqlQuery, param).then(
                function(resultSet){
                    var listProva = [];

                    for(var i = 0; i < resultSet.rows.length; i++){
                        var prova = {};
                        prova.id = resultSet.rows.item(i).id;
                        prova.nome = resultSet.rows.item(i).trabalho;
                        prova.peso = resultSet.rows.item(i).peso;
                        prova.nota = resultSet.rows.item(i).nota;
                        prova.id_materia = resultSet.rows.item(i).id_materia;
                        prova.ativo = resultSet.rows.item(i).ativo;

                        listProva.push(prova);
                    }
                    defer.resolve(listProva);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        mountList: function(id_materia){
            var defer = $q.defer();
            var finalList = [];
            var callExam = this.getListExams;
            var callHomework = this.getListHomework;

            callExam(id_materia).then(
                function(resultSet){
                    for(var i=0; i<resultSet.length; i++){
                        finalList.push(resultSet[i]);
                    }
                    callHomework(id_materia).then(
                        function(resultSet){
                            for(var i=0; i<resultSet.length; i++){
                                finalList.push(resultSet[i]);
                            }
                            defer.resolve(finalList);
                        },
                        function(error){
                            defer.reject(error);
                        }
                    )

                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        }
    }
});