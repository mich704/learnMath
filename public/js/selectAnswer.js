Array.from(values).forEach((element, index) => {
    //console.log(element)
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