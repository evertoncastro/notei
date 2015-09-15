/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceValidation', function(serviceConfig, $cordovaDialogs, serviceConstants){

    return{
        validateInput: function(data){
            var newData = data.newValue.toString().replace(/[^0-9.]+/g,'');
            if(newData != data.newValue){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);

                return data.oldValue;
            }else{
                var dataConfig = serviceConfig.getObjNotes();
                if(data.newValue < dataConfig.intervalo_de || data.newValue > dataConfig.intervalo_para || data.newValue == '' || data.newValue == null){
                    $cordovaDialogs.alert(
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.MSG+dataConfig.intervalo_de+' e '+dataConfig.intervalo_para,
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.ALERT,
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.BUTTON);

                    return data.oldValue;
                }
                return Number(newData);
            }

        }
    }
});