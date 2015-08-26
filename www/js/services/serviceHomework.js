/**
 * Created by everton on 26/08/15.
 */
var app = angular.module('anotei');

app.service('serviceHomework', function($q, factoryDatabase, serviceUtil, $cordovaDialogs, serviceConstants){

    var currentHomework = null;
    var currentSortHomework = 'asc';
    var currentHomeworkList = [];

    return{
        getHomeworks: function(typeSort){
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
                    console.log(error);
                }
            );

            return defer.promise;
        },

        insertHomework: function(data){
            var defer = $q.defer();
            var validator = 0;
            if(serviceUtil.isEmpty(data.trabalho)){validator = 1}
            else if(serviceUtil.isEmpty(data.data_entrega)){validator = 1}
            else if(serviceUtil.isEmpty(data.id_materia)){validator = 1}

            if(validator==1){
                defer.resolve(1);
            }else{
                var sqlQuery = 'insert into trabalhos ' +
                    '(trabalho, data_entrega, observacoes, peso, nota, id_materia) ' +
                    'values (?, ?, ?, ?, ?, ?)';

                var param = [data.trabalho, data.data_entrega, data.observacoes,
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

        updateHomework: function(data) {
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
                    'nota = ? where id = ?';

                var param = [data.titulo, data.data, data.observacoes,
                    data.peso, data.nota, data.id];

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

        deleteHomework: function(id){
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

        validDuplicatedAddHomework: function(list, id_materia, Homework){
            var validator = false;
            if(list.length){
                for(var i = 0; i<list.length; i++){
                    if(list[i].id_materia==id_materia && list[i].titulo==Homework){
                        validator = true;
                    }
                }
            }
            return validator;
        },

        validDuplicatedEditHomework: function(list, id_materia, Homework, id){
            var validator = false;
            if(list.length){
                for(var i = 0; i<list.length; i++){
                    if(list[i].id_materia==id_materia && list[i].titulo==Homework && list[i].id!=id){
                        validator = true;
                    }
                }
            }
            return validator;
        },

        setCurrentHomework: function(data){
            currentHomework = data;
        },

        getCurrentHomework: function(){
            return currentHomework;
        },

        setCurrentSortHomework: function(data){
            currentSortHomework = data;
        },

        getCurrentSortHomework: function(){
            return currentSortHomework;
        },

        setCurrentHomeworkList: function(list){
            currentHomeworkList = list;
        },

        getCurrentHomeworkList: function(){
            return currentHomeworkList;
        }
    }
});