/**
 * Created by everton on 11/08/15.
 */
var app = angular.module('anotei');

app.service('serviceExam', function($q, factoryDatabase, serviceUtil, $cordovaDialogs, serviceConstants){

    var currentExam = null;
    var currentSortExam = 'asc';
    var currentExamList = [];

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
                case 'asc':
                    sqlQuery = 'select ' +
                        'p.id, p.titulo, p.data, p.observacoes, p.peso, p.nota, p.id_materia, m.nome ' +
                        'from provas as p inner join materias as m ' +
                        'on p.id_materia = m.id group by m.nome, p.titulo ' +
                        'order by nome asc';
                    break;
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
                        //prova.data.setDate(prova.data.getDate() + 1);
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

                var param = [data.titulo, data.data, data.observacoes,
                    0, 0, data.id_materia];
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

        updateExam: function(data) {
            var validator = 0;
            if(serviceUtil.isEmpty(data.data)){validator = 1}
            var defer = $q.defer();
            if(validator==1){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_UPDATE_DATE_EMPTY.MSG,
                    serviceConstants.MSG_UPDATE_DATE_EMPTY.ALERT,
                    serviceConstants.MSG_UPDATE_DATE_EMPTY.BUTTON);
            }else if(validator==0){
                var sqlQuery = 'update provas set ' +
                    'titulo = ?, data = ?, ' +
                    'observacoes = ?, peso = ?, ' +
                    'nota = ?, id_materia = ? where id = ?';

                var param = [data.titulo, data.data, data.observacoes,
                    data.peso, data.nota, data.id_materia, data.id];

                factoryDatabase.executeQuery(sqlQuery, param).then(
                    function () {
                        defer.resolve();
                    },
                    function (error) {
                        defer.reject(error);
                    }
                );
                return defer.promise;
            }

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

        validDuplicatedAddExam: function(list, id_materia, exam){
            var validator = false;
            if(list.length){
                for(var i = 0; i<list.length; i++){
                    if(list[i].id_materia==id_materia && list[i].titulo==exam){
                        validator = true;
                    }
                }
            }
            return validator;
        },

        validDuplicatedEditExam: function(list, id_materia, exam, id){
            var validator = false;
            if(list.length){
                for(var i = 0; i<list.length; i++){
                    if(list[i].id_materia==id_materia && list[i].titulo==exam && list[i].id!=id){
                        validator = true;
                    }
                }
            }
            return validator;
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
        },

        setCurrentExamList: function(list){
            currentExamList = list;
        },

        getCurrentExamList: function(){
            return currentExamList;
        }
    }
});