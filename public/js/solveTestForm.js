document.getElementById("endTest").addEventListener('click', function() {
    var atLeastOneChecked = false;
    var exNumber = 0;

    function getChecked(element){
        checkedArray = []
        for(let radio of element){
            checkedArray.push(radio.checked)
        }
        return checkedArray
    }
    

    $("div#ex").each(function(){
        var msg =  document.getElementById(`msg${exNumber}`)
        var radios = this.querySelectorAll("input[type=radio]")
        //console.log(radios)
        var checkedArray = getChecked(radios)
       // console.log(checkedArray.includes(true))
       
        if(!checkedArray.includes(true)){
            msg.style.display ="inline-flex"
        }
        else{
            msg.style.display="none"
        }
       
        for(let radioIndex of radios){
            radioIndex.addEventListener('change', function(){
               // console.log(getChecked(this.querySelectorAll("input[type=radio]")).includes(true))
                if(radioIndex.checked || getChecked(this.querySelectorAll("input[type=radio]")).includes(true)){
                    msg.style.display="none"
                }
                //console.log(radioIndex.id, msg.id)
            })
        }
        
        exNumber+=1;
    })
    
        
});