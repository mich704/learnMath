///////////// CREATING RESPONSIVE FORM TO CHOOSE SOLUTION ///////////////////

function chooseAnswerMenu(){
    setInputValues();
  
    const btn = document.getElementById("addAnswers")
    var divElem = document.getElementById("possibleAnswers");   
    var description = document.getElementById("math-field0-input")  
   
    const getValues = (div) => {
        btn.disabled =false;
        var inputElements = divElem.querySelectorAll("input"); 
        var values = []
        for (const input of inputElements){
            values.push( input.value)
        }
        return values;
        
    }
    var values = getValues(divElem)
    if(!description.value){
        alert('Aby kontynuować dodaj polecenie')
        btn.disabled =false;
    }
    else if(values.includes('')){
        alert('Aby kontynuować dodaj 4 możliwe odpowiedzi')
        btn.disabled =false;
    }
    else if(new Set(values).size !== values.length){
        alert('Aby kontynuować dodaj różne odpowiedzi')
        btn.disabled =false;
    }
   
    else{

        var correctAnswer = document.createElement("div");
        correctAnswer.setAttribute("id", "correctAnswer");
        correctAnswer.classList.add('ms-3');
        correctAnswer.innerHTML +='<label>Dodaj rozwiązanie:</label>'
        divElem.addEventListener('click', ()=>{
            btn.disabled =false;
            
            correctAnswer.remove
        })
        if(document.getElementById("correctAnswer")){
            document.getElementById("correctAnswer").remove()
            values = getValues(divElem);
        }
        //console.log(correctAnswer)
        const options = ['A', 'B', 'C', 'D']
        Array.from(values).forEach((element, index) => {
           // console.log(element)
            let radioDIV = document.createElement(`div`);
            radioDIV.id = `radioDIV${index}`
            radioDIV.style = "display: inline"
            
            let radioControl =document.createElement(`div`);
           
            radioControl.setAttribute("aria-describedby", "basic-addon1")
            radioControl.innerHTML += `<input class="form-check-input" type="radio" name="exercise[solution]" id="flexRadioDefault${index}" value="${element}"  aria-describedby="basic-addon1" required>`
            
            let formLabel = document.createElement('label')
            formLabel.classList.add( "form-check-label");
            formLabel.classList.add( "card-text");
            formLabel.setAttribute("for", `flexRadioDefault${index}`)
            formLabel.setAttribute("id", `id${index}`)
           
            formLabel.innerHTML = options[index]

           
            // var jax;
            // MathJax.Hub.Queue(
            // ["Typeset",MathJax.Hub,`id${index}`],
            // function () {jax = MathJax.Hub.getAllJax(`id${index}`)[0]}
            // );
            //var innerHTML = require('../partials/answersRadio', {element})

            radioControl.appendChild(formLabel);
            radioDIV.appendChild(radioControl)
            correctAnswer.appendChild(radioDIV)
            
            
        })
       
        
        // console.log(radio)
        divElem.addEventListener('click', ()=>{
            correctAnswer.remove()
            saveBtn.style.display = "none";
        })
      
        btn.after(correctAnswer)
        document.getElementById("correctAnswer").scrollIntoView();   
        var saveBtn = document.getElementById("saveBtn")
        saveBtn.style.display = "block";
        btn.disabled =true;
    }
}

$(document).ready(function(){
    // Add smooth scrolling to all links
   // console.log()
    $("addAnswers").on('click', function(event) {
        const element = document.getElementById("saveBtn");
        element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
      
    });
  });
