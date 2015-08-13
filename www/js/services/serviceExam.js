/**
 * Created by everton on 11/08/15.
 */
var app = angular.module('anotei');

app.service('serviceExam', function($q, factoryDatabase, serviceUtil){

    var currentSubject = null;
    var currentSortSubject = undefined;

    return{
        getExams: function(typeSort){
            var defer = $q.defer();
            var sqlQuery = null;
            switch(typeSort){
                case 'desc':
                    sqlQuery = 'select ' +
                        'p.id, p.titulo, p.data, p.observacoes, p.peso, p.nota, p.id_materia, m.nome ' +
                        'from provas as p inner join materias as m ' +
                        'on p.id_materia = m.id group by m.nome, p.titulo ' +
                        'order by nome desc';
                    break;
                default:
                    sqlQuery = 'select ' +
                        'p.id, p.titulo, p.data, p.observacoes, p.peso, p.nota, p.id_materia, m.nome ' +
                        'from provas as p inner join materias as m ' +
                        'on p.id_materia = m.id group by m.nome, p.titulo';
            }

            var resp = factoryDatabase.executeQuery(sqlQuery);

            resp.then(
                function(resultSet){
                    var listProva = [];

                    for(var i = 0; i < resultSet.rows.length; i++){
                        var prova = {};

                        prova.id = resultSet.rows.item(i).id;
                        prova.titulo = resultSet.rows.item(i).titulo;
                        prova.data = resultSet.rows.item(i).data;
                        prova.observacoes = resultSet.rows.item(i).observacoes;
                        prova.peso = resultSet.rows.item(i).peso;
                        prova.nota = resultSet.rows.item(i).nota;
                        prova.id_materia = resultSet.rows.item(i).id_materia;
                        prova.nome = resultSet.rows.item(i).nome;

                        listProva.push(prova);
                    }
                    defer.resolve(listProva);
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
        },

        updateSubject: function(data){
            var defer = $q.defer();

            var sqlQuery = 'update materias set '+
            'nome = ?, max_faltas = ?, ' +
            'professor = ?, email_prof = ?, ' +
            'num_faltas = ? where id_materia = ?';

            var param = [data.nome, data.max_faltas, data.professor,
                        data.email_prof, data.num_faltas, data.id_materia];

            factoryDatabase.executeQuery(sqlQuery, param).then(
                function(){
                    defer.resolve();
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        deleteSubject: function(id){
            var defer = $q.defer();
            var sqlQuery = 'delete from materias where id_materia = ?';
            var param = [id];

            factoryDatabase.executeQuery(sqlQuery, param)
                .then(
                function(){
                    defer.resolve();
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        setCurrentSubject: function(data){
            currentSubject = data;
        },

        getCurrentSubject: function(){
            return currentSubject;
        },

        setCurrentSortSubject: function(data){
            currentSortSubject = data;
        },

        getCurrentSortSubject: function(){
            return currentSortSubject;
        }


    }

});