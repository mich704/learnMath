///////////// NOT USED /////////////////////////
function detect(expression){
    const res = []
    const ex1 = expression
    for(let ex of ex1.split(/\s+/)){
        if((ex.includes('\\') || ex.indexOf('\\')==0 ) && ex.slice(-1)!='\\'){
            res.push([true, ex])
        }else{
            if(ex.slice(-1)=='\\'){
                res.push([false, ex.slice(0,-1)])
            }else{
                res.push([false, ex])
            }
        }
    }
    return res;
}

module.exports = {
    detect: detect
}