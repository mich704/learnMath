

var possibleAnswersDiv = document.getElementById('formDiv');
if(possibleAnswersDiv){
  var mathSpans = possibleAnswersDiv.querySelectorAll("span");
  var mathFields = []
  var focusedSpan = null

  //console.log("ENGINE")
  for(let s of mathSpans){
    
    var MQ = MathQuill.getInterface(2);
    var mathField = MQ.MathField(s , {
      spaceBehavesLikeTab: false,
      leftRightIntoCmdGoes: 'up',
      restrictMismatchedBrackets: true,
      sumStartsWithNEquals: true,
      supSubsRequireOperand: true,
      charsThatBreakOutOfSupSub: '+-=<>',
      autoSubscriptNumerals: true,
      autoCommands: 'pi theta sqrt sum',
      autoOperatorNames: 'sin cos',
      maxDepth: 10,
      substituteTextarea: function() {
        return document.createElement('textarea');
      }
    });
    var mqRootBlock = s.getElementsByClassName('mq-root-block').item(0);
    mqRootBlock.style = 
          `
          display: -moz-inline-box;
          display: inline-block;
          width: 100%;
          padding: 2px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          white-space: normal;
          overflow: hidden;
          vertical-align: middle;
          word-wrap: break-word;
          `
    //console.log('mqr',mqRootBlock.innerHTML, s)
    mathFields.push(mathField);
   // console.log("AAA", mathField.innerHTML)
  
  }

  var mathFieldGL = null;


  function setFocusedSpan(id){
    //console.log(id)
    var mathFieldSpan = document.getElementById(id); 
    focusedSpan = mathFieldSpan
  }

  function input(str) {
    var fieldId = focusedSpan.id.slice(-1);
    //console.log(fieldId)
    mathFields[fieldId].cmd(str)
    mathFields[fieldId].focus()
    mathFields[fieldId].blur()  
  }

  function setInputValues(){
    for(let [index, value] of mathFields.entries()){
      var mathFieldInput = document.getElementById('math-field'+index+'-input');
      mathFieldInput.value = mathFields[index].latex()
    }
    
  }
}













