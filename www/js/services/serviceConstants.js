/**
 * Created by everton de castro on 05/08/2015.
 */
var app = angular.module('anotei');

app.service('serviceConstants', function() {
    return {

        DB_SCHEMA: 'CREATE TABLE trabalhos ( `id` integer, `trabalho` text NOT NULL, `data_entrega` text NOT NULL, `observacoes` text, `peso` numeric, `nota` numeric, `id_materia` INTEGER, `ativo` INTEGER DEFAULT "1", PRIMARY KEY(id) ); CREATE TABLE provas ( `id` integer, `titulo` text NOT NULL, `data` text NOT NULL, `observacoes` text, `peso` numeric, `nota` numeric, `id_materia` INTEGER, `ativo` INTEGER DEFAULT "1", PRIMARY KEY(id) ); CREATE TABLE materias ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `nome` TEXT NOT NULL, `max_faltas` INTEGER, `professor` TEXT, `email_prof` TEXT, `num_faltas` INTEGER ); CREATE TABLE `config_notas` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `intervalo_de` NUMERIC, `intervalo_para` NUMERIC, `media_minima` NUMERIC ); INSERT INTO `config_notas` VALUES(1,0,10,7)',

        MSG_SUCCESS_SUBJECT_NEW:            {MSG: 'Matéria criada com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_DATA_INVALID_SUBJECT_NEW:       {MSG: 'Dados preenchidos incorretamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_SUBJECT_NEW:               {MSG: 'Falha no banco de dados, tente novamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_INCOMPLETE_SUBJECT_NEW:         {MSG: 'Preencha o campo ', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_SUCCESS_EXAM_NEW:               {MSG: 'Prova criada com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_DATA_INVALID_EXAM_NEW:          {MSG: 'Dados preenchidos incorretamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_EXAM_NEW:                  {MSG: 'Falha no banco de dados, tente novamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_INCOMPLETE_EXAM_NEW:            {MSG: 'Preencha o campo ', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_SUCCESS_HOMEWORK_NEW:           {MSG: 'Trabalho criado com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_DATA_INVALID_HOMEWORK_NEW:      {MSG: 'Dados preenchidos incorretamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_HOMEWORK_NEW:              {MSG: 'Falha no banco de dados, tente novamente', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_INCOMPLETE_HOMEWORK_NEW:        {MSG: 'Preencha o campo ', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_UPDATE_TITLE_SUBJECT:           {MSG: 'Dados editados com sucesso! ', ALERT: 'Atualizar', BUTTON: 'OK'},
        MSG_CONFIRM_DELETE_SUBJECT:         {MSG: 'Excluir matéria', ALERT: 'Confirmar', BUTTON_OK: 'OK', BUTTON_CANCEL: 'Cancelar'},
        MSG_SUCCESS_DELETE_SUBJECT:         {MSG: 'Matéria excluída com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_DELETE_SUBJECT:            {MSG: 'Erro ao excluir matéria', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_UPDATE_TITLE_EXAM:              {MSG: 'Dados editados com sucesso! ', ALERT: 'Atualizar', BUTTON: 'OK'},
        MSG_CONFIRM_DELETE_EXAM:            {MSG: 'Excluir ', ALERT: 'Confirmar', BUTTON_OK: 'OK', BUTTON_CANCEL: 'Cancelar'},
        MSG_SUCCESS_DELETE_EXAM:            {MSG: 'Prova excluída com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_DELETE_EXAM:               {MSG: 'Erro ao excluir prova', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_UPDATE_TITLE_HOMEWORK:          {MSG: 'Dados editados com sucesso! ', ALERT: 'Atualizar', BUTTON: 'OK'},
        MSG_CONFIRM_DELETE_HOMEWORK:        {MSG: 'Excluir ', ALERT: 'Confirmar', BUTTON_OK: 'OK', BUTTON_CANCEL: 'Cancelar'},
        MSG_SUCCESS_DELETE_HOMEWORK:        {MSG: 'Trabalho excluído com sucesso!', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_FAIL_DELETE_HOMEWORK:           {MSG: 'Erro ao excluir trabalho', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_UPDATE_DATE_EMPTY:              {MSG: 'Campo data não pode ficar vazio! ', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_DUPLICATE_EXAM:                 {MSG: 'Já existe uma ', ALERT: 'Aviso', BUTTON: 'OK'},
        MSG_DUPLICATE_HOMEWORK:             {MSG: 'Esta matéria já possui um trabalho com o nome: ', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_EMPTY_CONFIG_NOTES:             {MSG: 'Nenhum campo pode ser vazio', ALERT: 'Aviso', BUTTON: 'OK'},

        MSG_DASHBOARD_CHANGES:              {MSG: 'Deseja gravar as alterações realizadas?', CONFIRM: 'Confirmar', BUTTON_YES: 'OK', BUTTON_NO: 'Cancel'},

        MSG_ALERT_FOR_INPUT_NOTES:          {MSG: 'O valor informado está fora do intervalo permitido. \nInforme um valor entre ', ALERT: 'Alerta', BUTTON: 'OK'},

        MSG_ALERT_INVALID_INPUTS:           {MSG: 'O valor informado possui espaços ou caracteres inválidos.', ALERT: 'Alerta', BUTTON: 'OK'},

        MSG_LARGE_INPUT_ATTENDANCE:         {MSG: 'Informe um valor menor que 100.', ALERT: 'Alerta', BUTTON: 'OK'},

        MSG_DUPLICATED_SUBJECT_NAME:        {MSG: 'Já existe uma matéria com o nome: ', ALERT: 'Alerta', BUTTON: 'OK'}

    }
});