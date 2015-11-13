/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceDatePicker', function($q, $cordovaDatePicker){

    return{

        //TODO: TDD
        inputByDatePicker: function(){
            var defer = $q.defer();
            var options = {
                date: new Date(),
                mode: 'date', // or 'time'
                minDate: new Date('Sat Jan 01 2000 00:00:00 GMT-0200 (BRST)'),
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };

            document.addEventListener("deviceready", function () {
                $cordovaDatePicker.show(options).then(
                    function(date){
                        defer.resolve(date);
                    },
                    function(error){
                        defer.reject();
                        console.log(error);
                    }
                );
            }, false);
            return defer.promise;
        },


        formatDate: function(usedDate){
            var date =  new Date(usedDate);
            var year = date.getFullYear().toString();
            var month = (date.getMonth()+1).toString();
            var day = date.getDate().toString();
            return (day[1]?day:"0"+day[0])+'/'+ (month[1]?month:"0"+month[0])+'/'+year;
        }
    }
});