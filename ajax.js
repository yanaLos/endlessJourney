//Взаимодействие с Ajax
var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
var records = []; 
var updatePassword;
var stringName='LOS_EndlessJourney';

function showRecords() {
    var table = document.getElementById('resultsTable');
    if (table.innerHTML) {
            table.innerHTML = '';
        }
    for ( var r=0; r<records.length; r++ ) {
        var record=records[r];
        var str = record.name + ':' + record.result;
        var tablePos = document.createElement('ol');
        tablePos.innerHTML = str;
        table.appendChild(tablePos);
    }
}

function refreshRecords() {
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'READ', n : stringName },
            cache : false,
            success : readReady,
            error : errorHandler
        }
    );
}

function readReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error); 
    else {
        records=[];
        if ( callresult.result!="" ) { 
            records=JSON.parse(callresult.result); 
        }
    }
    showRecords();
}

function sendRecords() {
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : stringName,
                p : updatePassword },
            cache : false,
            success : lockGetReady,
            error : errorHandler
        }
    );
}

function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error); 
    else {
        records=[];
            if ( callresult.result!="" ) { 
                records=JSON.parse(callresult.result); 
            }
                    var playerRecords= playerName || 'Аноним';
                    var resultRecords=Math.round(score);
                    records.push( { name:playerRecords, result:resultRecords} )
                    records.sort(compareNumeric);
            if ( records.length>10 ) {
                records=records.slice(0, records.length-1);
            }
            $.ajax( {
                    url : ajaxHandlerScript,
                    type : 'POST', dataType:'json',
                    data : { f : 'UPDATE', n : stringName,
                        v : JSON.stringify(records), p : updatePassword },
                    cache : false,
                    success : updateReady,
                    error : errorHandler
                }
            );
            
        }
    }

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error); 
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}



function compareNumeric(a, b) {
        return b.result - a.result;
    }