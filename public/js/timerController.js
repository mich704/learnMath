
function timerDisplay(toSolve){
    display = document.querySelector('#time');
    if (sessionStorage) {
        // Ask other tabs for session storage
        localStorage["getTmestamp"] = "get";

        window.addEventListener("storage", (event) => {
            if (event.key == "getTmestamp") {
            // Some tab asked for the sessionStorage -> send it
                localStorage["timestamp"] = sessionStorage["timestamp"];
                localStorage.removeItem("getTmestamp");
            } else if (event.key == "timestamp" && !sessionStorage["timestamp"]) {
                sessionStorage["timestamp"] = new Date(localStorage["timestamp"]);
                localStorage.removeItem("timestamp");
            }
        });
    } else {
        console.warn("Browser doesn't support sessionStorage");
    }
    var startTime;
    var interval = setInterval(() => {
    if (!startTime && sessionStorage && !sessionStorage["timestamp"]) {
        sessionStorage["timestamp"] = new Date();
        sessionStorage["solving"] = window.location.href;
    }
   
    startTime = new Date(sessionStorage["timestamp"]);
    
    
    var currentTime = new Date();
    var timeElapsed = Math.ceil((currentTime - startTime) / 1000);
    var remainingTime = toSolve - timeElapsed;
    var minutes = parseInt(remainingTime / 60, 10);
    var seconds = parseInt(remainingTime % 60, 10);

    var progressBar = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated')[0]
    var percent = 100-(seconds+minutes*60)/toSolve*100 ;
    progressBar.style.width = `${percent}%`
    display.textContent = minutes + "min " + seconds + "s";

    if (remainingTime <= 0) {
        console.log("Timeout");
        document.getElementById('endTest').click();
        clearInterval(interval);
        sessionStorage.clear()
        localStorage.clear()
    }
    //console.log("Session Time in seconds:", timeElapsed);

    ///console.log("Remaining Session Time in seconds:", remainingTime, 'min sec', minutes, seconds, sessionStorage);
    }, 1000);

}  

document.getElementById('endTest').addEventListener('click', ()=>{
    sessionStorage.clear()
    localStorage.clear()
})


   


    