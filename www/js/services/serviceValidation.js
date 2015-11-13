/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceValidation', function(serviceConfig, $cordovaDialogs, serviceConstants){

    var statusValidation = undefined;

    return{
        setStatusValidation: function(status){
            statusValidation = status;
        },

        getStatusValidation: function(){
            return statusValidation;
        },

        validateInputNotes: function(data){
            if(data.newValue != undefined && data.newValue.constructor===Number){
                data.newValue = data.newValue.toString();
            }
            if(data.oldValue != undefined && data.oldValue.constructor===Number){
                data.oldValue = data.oldValue.toString();
            }
            var newData = undefined;
            if(data && data.newValue){
                newData = data.newValue.toString().replace(/[^0-9.]+/g,'');
            }else{
                newData = '';
            }
            if(newData != data.newValue){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);
                this.setStatusValidation(false);
                return Number(data.oldValue);
            }else{
                var dataConfig = serviceConfig.getObjNotes();
                if(data.newValue < dataConfig.intervalo_de || data.newValue > dataConfig.intervalo_para || data.newValue == '' || data.newValue == null){
                    $cordovaDialogs.alert(
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.MSG+dataConfig.intervalo_de+' e '+dataConfig.intervalo_para,
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.ALERT,
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.BUTTON);
                    this.setStatusValidation(false);
                    return Number(data.oldValue);
                }
                this.setStatusValidation(true);
                return Number(newData);
            }
        },

        validateInputAttendance: function(data){
            if(data.newValue || data.newValue==0){
                var newData = data.newValue.toString().replace(/[^0-9.]+/g,'');
                if(newData != data.newValue){
                    $cordovaDialogs.alert(
                        serviceConstants.MSG_ALERT_INVALID_INPUTS_ATTENDANCE.MSG,
                        serviceConstants.MSG_ALERT_INVALID_INPUTS_ATTENDANCE.ALERT,
                        serviceConstants.MSG_ALERT_INVALID_INPUTS_ATTENDANCE.BUTTON);
                    this.setStatusValidation(false);
                    return data.oldValue;
                }if(newData>=101 || newData<0){
                    $cordovaDialogs.alert(
                        serviceConstants.MSG_LARGE_INPUT_ATTENDANCE.MSG,
                        serviceConstants.MSG_LARGE_INPUT_ATTENDANCE.ALERT,
                        serviceConstants.MSG_LARGE_INPUT_ATTENDANCE.BUTTON);
                    this.setStatusValidation(false);
                    return data.oldValue;
                }else{
                    this.setStatusValidation(true);
                    return Number(newData);
                }
            }else{
                return data.oldValue;
            }

        },

        //TODO: test
        validateInputConfig: function(value, input, oldValue){
            var newValue = undefined;
            var aux = undefined;
            var resp = true;
            switch (input){
                case 'intervalFrom':
                    if(value.intervalo_de || value.intervalo_de==0){
                        newValue = value.intervalo_de.toString().replace(/[^0-9.]+/g,'');
                    }
                    aux =  value.intervalo_de;
                    break;

                case 'intervalTo':
                    if(value.intervalo_para || value.intervalo_para==0){
                        newValue = value.intervalo_para.toString().replace(/[^0-9.]+/g,'');
                    }
                    aux =  value.intervalo_para;
                    break;

                case 'average':
                    if(value.media_minima || value.media_minima==0){
                        newValue = value.media_minima.toString().replace(/[^0-9.]+/g,'');
                    }
                    aux =  value.media_minima;
                    break;
            }
            if(!newValue || newValue != aux){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_ALERT_INVALID_INPUTS_SETTINGS.MSG,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS_SETTINGS.ALERT,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS_SETTINGS.BUTTON);
                resp = false;
                switch (input){
                    case 'intervalFrom':
                        value.intervalo_de = oldValue;
                        break;

                    case 'intervalTo':
                        value.intervalo_para = oldValue;
                        break;

                    case 'average':
                        value.media_minima =oldValue;
                        break;
                }
            }else if(Number(newValue)>100){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_LARGE_CONFIG_VALUE.MSG,
                    serviceConstants.MSG_LARGE_CONFIG_VALUE.ALERT,
                    serviceConstants.MSG_LARGE_CONFIG_VALUE.BUTTON);
                resp = false;
                switch (input){
                    case 'intervalFrom':
                        value.intervalo_de = oldValue;
                        break;

                    case 'intervalTo':
                        value.intervalo_para = oldValue;
                        break;

                    case 'average':
                        value.media_minima =oldValue;
                        break;
                }
            }
            if(resp){
                switch (input){
                    case 'intervalFrom':
                        value.intervalo_de = Number(newValue);
                        break;

                    case 'intervalTo':
                        value.intervalo_para = Number(newValue);
                        break;

                    case 'average':
                        value.media_minima = Number(newValue);
                        break;
                }
            }
            value.validation = resp;
            return value;

        }
    }
});