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
            var newData = data.newValue.toString().replace(/[^0-9.]+/g,'');
            if(newData != data.newValue){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);
                this.setStatusValidation(false);
                return data.oldValue;
            }else{
                var dataConfig = serviceConfig.getObjNotes();
                if(data.newValue < dataConfig.intervalo_de || data.newValue > dataConfig.intervalo_para || data.newValue == '' || data.newValue == null){
                    $cordovaDialogs.alert(
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.MSG+dataConfig.intervalo_de+' e '+dataConfig.intervalo_para,
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.ALERT,
                        serviceConstants.MSG_ALERT_FOR_INPUT_NOTES.BUTTON);
                    this.setStatusValidation(false);
                    return data.oldValue;
                }
                this.setStatusValidation(true);
                return Number(newData);
            }
        },

        validateInputAttendance: function(data){
            var newData = data.newValue.toString().replace(/[^0-9.]+/g,'');
            if(newData != data.newValue){
                $cordovaDialogs.alert(
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.MSG,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.ALERT,
                    serviceConstants.MSG_ALERT_INVALID_INPUTS.BUTTON);
                this.setStatusValidation(false);
                return data.oldValue;
            }if(newData>=100){
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
        }
    }
});