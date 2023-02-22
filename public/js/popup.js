// When the user clicks on div, open the popup
function myFunction(id) {
    var popups = document.getElementsByClassName("popuptext")
   
    var parent = document.getElementById(id)
    var popup = parent.childNodes[1];
   
    for(var i = 0; i < popups.length; i++)
    {
        if(popup !== popups[i]){
            popups[i].classList.remove("show");
        }
    }

    popup.classList.toggle("show");
}