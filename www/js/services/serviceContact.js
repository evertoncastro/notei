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
                    to: 'anotei.app@gmail.com',
                    subject: 'Sugestões para o aplicativo Anotei',
                    body: '',
                    isHtml: false
                };

                //TODO: tests
                serviceGA.gaTrackerEvent('Category: Contact', 'Event: Email to', 'Description: suggestion', '');

            }else if(type=='error'){
                email = {
                    to: 'anotei.app@gmail.com',
                    subject: 'Erros encontrados no aplicativo Anotei',
                    body: '',
                    isHtml: false
                };

                //TODO: tests
                serviceGA.gaTrackerEvent('Category: Contact', 'Event: Email to', 'Description: error', '');
            }
            $cordovaEmailComposer.open(email).then(
                function(){
                   defer.resolve(true);
                    //TODO: tests
                    serviceGA.gaTrackerEvent('Category: Contact', 'Event: Email to', 'Description: sent with success', '');
                },
                function(error){
                    defer.reject(error);
                }
            );
            return defer.promise;
        }
    }
});