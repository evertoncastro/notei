/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceContact', function($q, $cordovaEmailComposer){

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
            }else if(type=='error'){
                email = {
                    to: 'anotei.app@gmail.com',
                    subject: 'Erros encontrados no aplicativo Anotei',
                    body: '',
                    isHtml: false
                };
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