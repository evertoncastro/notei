/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceSubject', function($q, factoryDB){

    return{
        getSubjects: function(){
            var defer = $q.defer();
            var sqlQuery = 'select * from materias';

            var resp = factoryDB.executeQuery(sqlQuery);

            resp.then(
                function(resultSet){

                },
                function(error){

                }
            );

            return defer.promise;
        }
    }

});