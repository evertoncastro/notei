/**
 * Created by everton de castro on 05/08/2015.
 */
var app = angular.module('anotei');

app.service('serviceConstants', function() {
    return {


        MSG_SUCCESS_SUBJECT_NEW:            {MSG: 'Dados cadastrado com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_DATA_INVALID_SUBJECT_NEW:       {MSG: 'Dados preenchidos incorretamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_SUBJECT_NEW:               {MSG: 'Falha no banco de dados, tente novamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_INCOMPLETE_SUBJECT_NEW:         {MSG: 'Preencha o campo ', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_UPDATE_TITLE_SUBJECT:           {MSG: 'Dados editados com sucesso ', ALERT: 'Atualizar', BUTTON: 'OK'}


    }
});