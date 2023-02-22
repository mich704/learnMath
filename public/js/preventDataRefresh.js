//console.log(window.sessionStorage)
var timeToSolve = document.getElementById('timeToSolve').innerText;

display = document.querySelector('#time');
//window.sessionStorage.setItem('timeToSolve', timeToSolve)


//Timer();
jQuery(document).ready(function(){
    jQuery("#testForm").on("submit",function(){
        document.cookie += '=; Max-Age=-99999999;' 
    });
});




function getSecondsDiff(startDate, endDate) {
  const msInSecond = 1000;

  return Math.round(
    Math.abs(endDate - startDate) / msInSecond
  );
}

window.onload = (event)=> {

    var isFirstVisit = function checkFirstVisit() {
        ///alert(document.cookie.indexOf('mycookie')==-1)
      
        // firstVISIT OF PAGE
        if(document.cookie.indexOf('mycookie')==-1)  {
            //console.log('first visit')
            // cookie doesn't exist, create it now
            var radios =  document.querySelectorAll(`[class='form-check-input']`)
            for(var i = 0; i < radios.length; i++){
                radios[i].checked = false;
                //console.log(radios[i])
            }
            console.log(sessionStorage)       
            sessionStorage.clear();
            document.cookie = 'mycookie=1';
      
            return true
        }
        else {
       
            return false
        }
    }
   
   
    const wasReloaded = (performance.navigation.type == performance.navigation.TYPE_RELOAD)
    var visit = isFirstVisit()
    console.log(visit)
    if (wasReloaded && !visit) {
        Object.keys(sessionStorage).forEach(function(key){
            var input = sessionStorage.getItem(key);
            if (input !== null){
                var radios =  document.querySelectorAll(`[id='${key}']`)
                for(var i = 0; i < radios.length; i++){
                    // If values are not blank, restore them to the fields
                    if(radios[i].value === input){
                        radios[i].checked = true;
                        // console.log('radio', radios[i])
                    }
                }              
            } 
        });
        
    } 

    
    console.log('BEFORE')
    window.history.forward()
}

// Before refreshing the page, save the form data to sessionStorage
window.onbeforeunload = function(event) {
    //document.cookie.indexOf('mycookie')=-1
    
    var form_datas =  jQuery("#testForm").serializeArray();
        jQuery.each(form_datas, function(i, field){
            sessionStorage.setItem(field.name,field.value);
    });
   
}