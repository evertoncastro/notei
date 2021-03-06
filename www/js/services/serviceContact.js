/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceContact', function($q, $cordovaEmailComposer, serviceGA){

    return{
        sendEmail : function(type){
            var defer = $q.defer();
            var email = {};
            if(type=='suggestion'){
                email = {
                    to: 'educa.appcentral@gmail.com',
                    subject: 'Sugestões para o aplicativo Anotei',
                    body: '',
                    isHtml: false
                };

                //TODO: tests
                serviceGA.gaTrackerEvent('Contact', 'Email to', 'suggestion', '');

            }else if(type=='error'){
                email = {
                    to: 'educa.appcentral@gmail.com',
                    subject: 'Erros encontrados no aplicativo Anotei',
                    body: '',
                    isHtml: false
                };

                //TODO: tests
                serviceGA.gaTrackerEvent('Contact', 'Email to', 'error', '');
            }
            $cordovaEmailComposer.open(email).then(
                function(){
                   defer.resolve(true);
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        }
    }
});