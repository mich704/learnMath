var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    if(coll[i].id === 'blocked'){
        coll[i].style.backgroundColor = '#f1f1f1';
        coll[i].style.zIndex = '1';
    }
    
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if(content.firstElementChild){
            if( content.id!=='blocked'){
                console.log(content.firstElementChild)
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                    content.scrollIntoView({behavior: 'smooth', top: 0});
                    //content.scrollIntoView({block: 'start', inline: 'start', margin: '50% 0 50%'});
                }
            }
            else{
                alert(`Zdobądź więcej gwiazdek aby odblokować ten poziom trudności!`)
            }
        }else{
            if( content.id==='blocked'){
                alert("Zdobądź więcej gwiazdek aby odblokować ten poziom trudności!")
            }
            else{
                alert("Brak testów o podanej trudności!") 
            }
            
        }
        
});
}