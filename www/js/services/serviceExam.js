/**
 * Created by everton on 11/08/15.
 */
var app = angular.module('anotei');

app.service('serviceExam', function($q, factoryDatabase, serviceUtil){

    var currentExam = null;
    var currentSortExam = undefined;

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
                        prova.data = new Date(resultSet.rows.item(i).data);
                        prova.data.setDate(prova.data.getDate() + 1);
                        prova.observacoes = resultSet.rows.item(i).observacoes;
                        prova.peso = resultSet.rows.item(i).peso;
                        prova.nota = resultSet.rows.item(i).nota;
                        prova.id_materia = resultSet.rows.item(i).id_materia;

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

        insertExam: function(data){
            var defer = $q.defer();
            var validator = 0;
            if(serviceUtil.isEmpty(data.titulo)){validator = 1}
            else if(serviceUtil.isEmpty(data.data)){validator = 1}
            else if(serviceUtil.isEmpty(data.id_materia)){validator = 1}

            if(validator==1){
                defer.resolve(1);
            }else{
                var sqlQuery = 'insert into provas ' +
                    '(titulo, data, observacoes, peso, nota, id_materia) ' +
                    'values (?, ?, ?, ?, ?, ?)';

                data.data = serviceUtil.formatDate(data.data);

                var param = [data.titulo, data.data, data.observacoes,
                    data.peso, data.nota, data.id_materia];

                var resp = factoryDatabase.executeQuery(sqlQuery, param);
                resp.then(
                    function(){
                        defer.resolve(2);
                    },

                    function(error){
                        defer.reject(error);
                    }
                );
            }
            return defer.promise;
        },

        updateExam: function(data){
            var defer = $q.defer();

            var sqlQuery = 'update provas set ' +
                'titulo = ?, data = ?, ' +
                'observacoes = ?, peso = ?, nota = ?, ' +
                'id_materia = ? where id = ?';

            data.data = serviceUtil.formatDate(data.data);

            var param = [data.titulo, data.data, data.observacoes,
                        data.peso, data.nota, data.id_materia, data.id];

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

        deleteExam: function(id){
            var defer = $q.defer();
            var sqlQuery = 'delete from provas where id = ?';
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

        setCurrentExam: function(data){
            currentExam = data;
        },

        getCurrentExam: function(){
            return currentExam;
        },

        setCurrentSortExam: function(data){
            currentSortExam = data;
        },

        getCurrentSortExam: function(){
            return currentSortExam;
        }


    }

});