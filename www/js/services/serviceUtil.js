/**
 * Created by everton on 30/07/15.
 */
var app = angular.module('anotei');

app.service('serviceUtil', function(){

    return{
        isEmpty: function(value){
            if(value==0 && typeof(value)=="number"){
                return false;
            }else if(value == undefined || value == null || value == '' || value==""){
                return true;
            }else{
                return false;
            }
        },

        formatDate: function(usedDate){
            var date =  new Date(usedDate);
            var year = date.getFullYear().toString();
            var month = (date.getMonth()+1).toString();
            var day = date.getDate().toString();
            return year +'-'+ (month[1]?month:"0"+month[0]) +'-'+ (day[1]?day:"0"+day[0]);
        },

        parseToString: function (valDate, options) {
            if (!valDate) return valDate; // skip...

            // skip 2...
            if (!valDate instanceof Date) return valDate;

            // skip 3
            if (!options) return valDate;

            var result = '';

            try{
                // get token to format date....
                var resultOpt = options.split(/[^A-Za-z]/);
                var token = options.replace(/m/g, '');
                token = token.replace(/d/g, '');
                token = token.replace(/a/g, '');
                if (token.length > 1) token = token.charAt(0);
                //console.log('TOKEN: ' + token);

                // check first option....
                for(var i = 0; i < resultOpt.length; i++){
                    var optTemp = resultOpt[i];
                    //console.log(optTemp);


                    if (optTemp.indexOf('d') != -1){
                        result += this.formatDecimal(valDate.getDate(), optTemp.length, '0') + token;
                    }else if(optTemp.indexOf('m') != -1){
                        result += this.formatDecimal((valDate.getMonth() + 1), optTemp.length, '0') + token;
                    }else if (optTemp.indexOf('a') != -1){
                        result += valDate.getFullYear() + token;
                    }
                }

                // remove last position of token....
                if (result.length > 0)
                    result = result.substr(0, result.length - 1);
            }catch(e){
                console.error(e.message);
                //return valueDt;
            }

            return result;
        },

        stringToDate: function(valDate, options){
            var result = undefined;

            // skip...
            if (valDate instanceof Date) return valDate;

            // skip 2....
            if (!valDate) return valDate;

            try{
                // get token to format date....
                var resultOpt = options.split(/[^A-Za-z]/);
                var token = options.replace(/m/g, '');
                token = token.replace(/d/g, '');
                token = token.replace(/a/g, '');
                if (token.length > 1) token = token.charAt(0);
                //console.log('TOKEN: ' + token);

                var day, month, year;
                var valParsed = valDate.split(token);

                // check first option....
                for(var i = 0; i < resultOpt.length; i++){
                    var optTemp = resultOpt[i];
                    //console.log(optTemp);
                    //console.log(valParsed[i]);

                    if (optTemp.indexOf('d') != -1){
                        day = valParsed[i];
                    }else if(optTemp.indexOf('m') != -1){
                        month = valParsed[i];
                    }else if (optTemp.indexOf('a') != -1){
                        year = valParsed[i];
                    }
                }

                if (day && month && year){
                    result = new Date(year, (month -1), day);
                }


            }catch(e){
                console.error(e.message);
            }

            return result;
        }
    }
});