/**
 * Created by everton on 07/09/15.
 */
var app = angular.module('anotei');

app.service('serviceDashBoard', function($q, factoryDatabase, serviceConfig, serviceExam, serviceHomework,
                                         $cordovaDialogs, serviceConstants, serviceGA){

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
                        prova.data = new Date(resultSet.rows.item(i).data);
                        prova.peso = resultSet.rows.item(i).peso;
                        prova.nota = resultSet.rows.item(i).nota;
                        prova.id_materia = resultSet.rows.item(i).id_materia;
                        prova.observacoes = resultSet.rows.item(i).observacoes;
                        prova.tipo = 'prova';
                        if(resultSet.rows.item(i).ativo==1){
                            prova.ativo = true;
                        }else if(resultSet.rows.item(i).ativo==0){
                            prova.ativo = false;
                        }
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
                    var listTrbalho = [];

                    for(var i = 0; i < resultSet.rows.length; i++){
                        var trabalho = {};
                        trabalho.id = resultSet.rows.item(i).id;
                        trabalho.nome = resultSet.rows.item(i).trabalho;
                        trabalho.data_entrega = new Date(resultSet.rows.item(i).data_entrega);
                        trabalho.peso = resultSet.rows.item(i).peso;
                        trabalho.nota = resultSet.rows.item(i).nota;
                        trabalho.id_materia = resultSet.rows.item(i).id_materia;
                        trabalho.observacoes = resultSet.rows.item(i).observacoes;
                        trabalho.tipo = 'trabalho';
                        if(resultSet.rows.item(i).ativo==1){
                            trabalho.ativo = true;
                        }else if(resultSet.rows.item(i).ativo==0){
                            trabalho.ativo = false;
                        }
                        listTrbalho.push(trabalho);
                    }
                    defer.resolve(listTrbalho);
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
        },

        calcAverage: function(list){
            var average = null;
            var configNotes = serviceConfig.getObjNotes();
            var maxNote = configNotes.intervalo_para;
            if(list.constructor==Array){
                for(var i=0; i<list.length; i++){
                    var activity = list[i];
                    if(activity.ativo==true && activity.peso>0){
                        average = average + (activity.peso/maxNote)*activity.nota;
                    }
                }
            }
            if(average==null){
                average = 0;
            }
            return average.toFixed(2);
        },

        changeShowActivity: function(data){
            var defer = $q.defer();
            var sqlQuery = '';
            var params = [];
            if(data.tipo=='prova'){
                sqlQuery = 'update provas set ativo = ? where id = ?';
            }else if(data.tipo=='trabalho'){
                sqlQuery = 'update trabalhos set ativo = ? where id = ?';
            }
            if(data.ativo==true){
                params.push(1);
            }else if(data.ativo==false){
                params.push(0);
            }
            params.push(data.id);

            factoryDatabase.executeQuery(sqlQuery, params).then(
                function(result){
                    defer.resolve(result);
                    //TODO: tests
                    serviceGA.gaTrackerEvent('Category: Activity', 'Event: show: '+data.ativo, 'Description: type: '+data.tipo, '');
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        },

        multipleUpdate: function(listActivities){
            var defer = $q.defer();
            $cordovaDialogs.confirm(serviceConstants.MSG_DASHBOARD_CHANGES.MSG,
                serviceConstants.MSG_DASHBOARD_CHANGES.CONFIRM,
                [serviceConstants.MSG_DASHBOARD_CHANGES.BUTTON_YES,
                 serviceConstants.MSG_DASHBOARD_CHANGES.BUTTON_NO]).then(
                function(buttonIndex){
                    if(buttonIndex==1){
                        for(var i=0; i<listActivities.length; i++){
                            var activity = listActivities[i];
                            if(activity.tipo=='prova'){
                                activity.titulo = activity.nome;
                                serviceExam.updateExam(activity);
                            }else if(activity.tipo=='trabalho'){
                                activity.trabalho = activity.nome;
                                serviceHomework.updateHomework(activity);
                            }
                        }
                    }
                    defer.resolve();
                }
            );
            return defer.promise;
        }
    }
});