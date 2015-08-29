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
                    sqlQuery = 'select t.id, t.trabalho, t.data_entrega, t.observacoes, t.peso, t.nota,t.id_materia, m.nome '+
                    'from trabalhos as t inner join materias as m on t.id_materia = m.id ' +
                        'group by m.nome, t.trabalho order by nome desc';
                    break;
                case 'asc':
                    sqlQuery = 'select t.id, t.trabalho, t.data_entrega, t.observacoes, t.peso, t.nota,t.id_materia, m.nome '+
                        'from trabalhos as t inner join materias as m on t.id_materia = m.id ' +
                        'group by m.nome, t.trabalho order by nome asc';
                    break;
            }

            var resp = factoryDatabase.executeQuery(sqlQuery);

            resp.then(
                function(resultSet){
                    var listTrabalho = [];

                    for(var i = 0; i < resultSet.rows.length; i++){
                        var trabalho = {};

                        trabalho.id = resultSet.rows.item(i).id;
                        trabalho.trabalho = resultSet.rows.item(i).trabalho;
                        trabalho.data_entrega = new Date(resultSet.rows.item(i).data_entrega);
                        trabalho.observacoes = resultSet.rows.item(i).observacoes;
                        trabalho.peso = resultSet.rows.item(i).peso;
                        trabalho.nota = resultSet.rows.item(i).nota;
                        trabalho.id_materia = resultSet.rows.item(i).id_materia;
                        trabalho.nome = resultSet.rows.item(i).nome;

                        listTrabalho.push(trabalho);
                    }
                    defer.resolve(listTrabalho);
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
            if(serviceUtil.isEmpty(data.data_entrega)){validator = 1}
            var defer = $q.defer();
            if(validator==1){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_UPDATE_DATE_EMPTY.MSG,
                    serviceConstants.MSG_UPDATE_DATE_EMPTY.ALERT,
                    serviceConstants.MSG_UPDATE_DATE_EMPTY.BUTTON);
            }else if(validator==0){
                var sqlQuery = 'update trabalhos set ' +
                    'trabalho = ?, data_entrega = ?, ' +
                    'observacoes = ?, peso = ?, ' +
                    'nota = ?, id_materia = ? where id = ?';

                var param = [data.trabalho, data.data_entrega, data.observacoes,
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

        deleteHomework: function(id){
            var defer = $q.defer();
            var sqlQuery = 'delete from trabalhos where id = ?';
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

        validDuplicatedAddHomework: function(list, id_materia, homework){
            var validator = false;
            if(list.length){
                for(var i = 0; i<list.length; i++){
                    if(list[i].id_materia==id_materia && list[i].trabalho==homework){
                        validator = true;
                    }
                }
            }
            return validator;
        },

        validDuplicatedEditHomework: function(list, id_materia, homework, id){
            var validator = false;
            if(list.length){
                for(var i = 0; i<list.length; i++){
                    if(list[i].id_materia==id_materia && list[i].trabalho==homework && list[i].id!=id){
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