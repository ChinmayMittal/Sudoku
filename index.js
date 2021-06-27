const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];
 const empty = [ "---------------------------------------------------------------------------------"]  ;
  var timer ; 
  var timeRemaining ; 
  var lives ; 
  var livesRemaining ; 
  var selectedNum ; 
  var selectedTile ; 
  var disableSelect ; 
  var solution ; 
  window.onload = function(){
    id('start-btn').addEventListener("click" , startGame ) ;
    
    for( let i = 0 ; i < id('number-container').children.length ; i++ ){
        id('number-container').children[i].addEventListener('click' , number_listener) ; 
    }
  };
  function number_listener(){
    if(!disableSelect){
        if(selectedNum != this ){
            for(var j = 0 ; j < id('number-container').children.length ; j++ ){
                id('number-container').children[j].classList.remove('selected') ; 
            }
            this.classList.add('selected') ;
            selectedNum = this ; 
            updateMove() ; 
        }else{
            id('number-container').children[i].classList.remove('selected') ; 
            selectedNum = null  ; 
        }
    }
  }
  function startTimer(){
      if(id('time-1').checked) timeRemaining = 180 ; 
      else if (id('time-2').checked) timeRemaining = 300 ; 
      else timeRemaining = 600 ; 
      id('timer').textContent = timeConversion(timeRemaining) ; 

      timer = setInterval(function(){
          timeRemaining -- ; 
          if( timeRemaining==0) endGame() ; 
          id('timer').textContent = timeConversion(timeRemaining) ; 
      } , 1000  ) ; 
  }
  function timeConversion(time){
      let minutes = Math.floor(time/60) ; 
      seconds = time - minutes*60 ; 
      if(minutes <= 9 ) minutes = '0' + minutes ;
      if(seconds<=9) seconds = '0' +  seconds ; 
      return  minutes + ":" + seconds ; 
  }
  function startGame(){
      let board ; 
      if(id("diff-1").checked) { board = easy[0] ; solution = easy[1] ; } 
      else if (id("diff-2").checked) { board = medium[0] ; solution = medium[1] ;  }  
      else if(id('diff-3').checked) { board = hard[0] ; solution = hard[1] ; } 
      else {
          board = empty[0] ; 
          disableSelect = false ; 
          if(id('theme-1').checked) document.body.classList.remove('dark') ; 
          else document.body.classList.add('dark') ; 
          id("number-container").classList.remove('hidden') ; 
          if(!id('solve-btn')){
            let btn = document.createElement('button');
            btn.textContent = "Solve the board  ! " ; 
            btn.addEventListener('click' , solve_board) ; 
            btn.id = "solve-btn" ; 
            btn.classList.add('btn') ; 
            id('buttons').appendChild(btn) ; 
          }
          helper_sudoku() ; 
          return ; 
        } 
        for( let i = 0 ; i < id('number-container').children.length ; i++ ){
            id('number-container').children[i].addEventListener('click' , number_listener) ; 
            id('number-container').children[i].removeEventListener('click' , solver_number_listener ) ; 
        }
      if(id('solve-btn'))id('solve-btn').remove() ; 
      livesRemaining = 3 ; 
      disableSelect = false ; 
      id("lives").textContent =  "lives remaining : " + livesRemaining ; 
      generateBoard(board) ; 
      startTimer() ; 
      if(id('theme-1').checked) document.body.classList.remove('dark') ; 
      else document.body.classList.add('dark') ; 
      id("number-container").classList.remove('hidden') ; 
  }

  function generateBoard(board){

    clearPrevious() ; 
    let idCount = 0 ; 

    for( let i = 0 ; i<81 ; i++ ){
        let tile = document.createElement('p') ; 
        if(board.charAt(i)!='-'){
            tile.textContent = board.charAt(i) ; 
        }else{
            tile.addEventListener("click" , function(){

                if(!disableSelect){
                    if(tile.classList.contains('selected')){
                        tile.classList.remove('selected') ; 
                        selectedTile = null ; 
                    }else{
                        for( var i = 0 ; i < qsa('.tile').length ; i++){
                            qsa('.tile')[i].classList.remove('selected') ; 
                        }
                        tile.classList.add('selected') ; 
                        selectedTile = tile ; 
                        updateMove() ; 
                    }
                }
            }) ; 
        }
        //setting the id for the current tile 
        tile.id = idCount ; 
        //settting up the idcount varialble for the next turn 
        idCount ++ ; 

        tile.classList.add("tile") ; 
        if((tile.id > 17 && tile.id < 27 ) || (tile.id > 44 && tile.id<54 )){
            tile.classList.add('bottomBorder') ; 
        }
        if(tile.id % 9 == 2 || tile.id % 9 == 5){
            tile.classList.add('rightBorder') ; 
        }
        id('board').appendChild(tile) ; 
    }

  }
  function updateMove(){

    if(selectedTile!=null && selectedNum!=null ){
        selectedTile.textContent = selectedNum.textContent ; 
        
        if(checkCorrect(selectedTile)){
            selectedNum.classList.remove('selected') ; 
            selectedTile.classList.remove('selected');
            selectedTile = null ;
            selectedNum = null ; 
            if(checkBoardComplete()){
                endGame() ; 
            } 
        }else{

            disableSelect = true ; 
            selectedTile.classList.add('incorrect') ; 

            setTimeout( function(){
                livesRemaining -- ; 
                if(livesRemaining === 0 ) { endGame() ; }
                else{
                    id('lives').textContent = "Lives Remaining : " + livesRemaining ; 
                    disableSelect = false ; 
                }

             selectedTile.classList.remove('incorrect'); 
             selectedTile.classList.remove('selected') ;   
             selectedNum.classList.remove('selected') ;
             
             selectedTile.textContent = "" ; 
             selectedTile = null ;
             selectedNum = null ; 

            }, 1000 ) ; 
        }
    }

  }

  function checkCorrect(tile){
    if(solution.charAt(tile.id)== tile.textContent) return true ; 
    else return false ; 
}
function clearPrevious(){

    let tiles = qsa('.tile') ; 

    for(let i = 0 ; i < tiles.length ; i ++ ){
        tiles[i].remove() ; // removes the selected element from the document
    }
    // stops the setTimeout function from executing 
    if( timer ) clearTimeout(timer) ; 

    for( let i = 0 ; i < id("number-container").children.length ; i ++ ){
        id("number-container").children[i].classList.remove('selected')
    }
    //clearing the selected variables for the new game 
    selectedTile = null; 
    selectedNum = null ; 
}







function checkBoardComplete(){

    let tiles = qsa('.tile') ; 
    for( let i = 0 ; i<81 ; i++ ){
        if( tiles[i].textContent != solution.charAt(i) )
        {
            return false  ; 
        }
    }
    return true ; 
}

function endGame(){
    disableSelect = true ; 
    clearTimeout(timer) ; 
    if( livesRemaining === 0 || timeRemaining == 0 ){
        id('lives').textContent = "You Loss ! " ;
    }else{
        id('lives').textContent = 'You Won ! ' ; 
    }
}

function helper_sudoku(){

        solver_generate_board() ; 
 


}
function genereate_empty_board(){

    let idCount = 0 ; 
    for(idCount = 0 ; idCount < 81 ; idCount++){
        let tile = document.createElement('p') ; 
        tile.addEventListener("click" , function(){

            if(!disableSelect){
                if(tile.classList.contains('selected')){
                    tile.classList.remove('selected') ; 
                    selectedTile = null ; 
                }else{
                    for( var i = 0 ; i < qsa('.tile').length ; i++){
                        qsa('.tile')[i].classList.remove('selected') ; 
                    }
                    tile.classList.add('selected') ; 
                    selectedTile = tile ; 
                    helper_updateMove() ; 
                }
            }
        }) ; 
        tile.id = idCount ; 
        tile.textContent= "" ; 
        tile.classList.add("tile") ; 
        if((tile.id > 17 && tile.id < 27 ) || (tile.id > 44 && tile.id<54 )){
            tile.classList.add('bottomBorder') ; 
        }
        if(tile.id % 9 == 2 || tile.id % 9 == 5){
            tile.classList.add('rightBorder') ; 
        }
        id('board').appendChild(tile) ; 
    }
}
function helper_updateMove(){

    if(selectedNum!=null && selectedTile!=null){
        selectedTile.textContent = selectedNum.textContent ; 
       if(board_possible(selectedTile.id)){
           selectedTile.classList.remove('selected') ; 
           selectedNum.classList.remove('selected') ; 
           selectedTile = null ; 
           selectedNum = null ; 
       }else{
           disableSelect = true ; 
           selectedTile.classList.add('incorrect') ; 

           setTimeout( function(){

            disableSelect = false ; 

            selectedTile.classList.remove('incorrect'); 
            selectedTile.classList.remove('selected') ;   
            selectedNum.classList.remove('selected') ;
            
            selectedTile.textContent = "" ; 
            selectedTile = null ;
            selectedNum = null ; 

           }, 1000 ) ; 

       } 
    }
}
function solver_number_listener(){
    if(!disableSelect){
        if(selectedNum != this ){
            for(var j = 0 ; j < id('number-container').children.length ; j++ ){
                id('number-container').children[j].classList.remove('selected') ; 
            }
            this.classList.add('selected') ;
            selectedNum = this ; 
            helper_updateMove() ; 
        }else{
            id('number-container').children[i].classList.remove('selected') ; 
            selectedNum = null  ; 
        }
    }
}

function solver_generate_board(){

    for( let i = 0 ; i < id('number-container').children.length ; i++ ){
        id('number-container').children[i].removeEventListener('click' , number_listener) ; 
        id('number-container').children[i].addEventListener('click' , solver_number_listener ) ; 
    }
     id('lives').textContent = "" ; 
     id('timer').textContent = "" ; 
    clearPrevious() ; 
    genereate_empty_board() ; 
}


function board_possible(idx){

    let tiles = qsa('.tile') ; 
    for( var i = Math.floor(idx/9)*9 ; i<Math.floor(idx/9)*9+9 ; i++ ){
        if(i !=idx && tiles[i].textContent==tiles[idx].textContent){
            return  false ; 
        }
    }
    for( var j = idx % 9 ; j < 81 ; j+=9  ){
        if(j !=idx && tiles[j].textContent==tiles[idx].textContent){
            return  false ; 
        }
    }

    var row = Math.floor(idx/9) ; 
    var col = idx%9 ; 


    for( var i = Math.floor(row/3)*3 ; i <  Math.floor(row/3)*3 + 3 ; i++ ){
        for( var j = Math.floor(col/3)*3 ; j < Math.floor(col/3)*3 + 3 ; j++ ){
            if( i*9 + j != idx && tiles[i*9+j].textContent == tiles[idx].textContent ){
                return false ; 
            }
        }
    }

    return true ; 
}


function solve_board(){
   if( solve_board_helper() ) {
       id('lives').textContent = "Success ! " ; 
   } else{
        id('lives').textContent = "No solution " ; 
   }
}

function solve_board_helper(idx=0){
    if(idx==81) return true ; 

    let tiles = qsa('.tile') ; 
    if(tiles[idx].textContent!=""){
        return solve_board_helper(idx+1);
    }else{
        for( var i = 1 ; i<=9 ; i ++ ){
            tiles[idx].textContent = i ; 
            setTimeout(function(){console.log("hi");} , 1000 ) ; 
            if(board_possible(idx)){
                if(solve_board_helper(idx+1)){
                    return true ; 
                }else{
                   tiles[idx].textContent = "" ;  
                }
            } else{
                tiles[idx].textContent = "" ; 
                continue ; 
            }
        }
        return false ; 
    }
}


// ---------------- helper functions for DOM manipulation ---------------

function qs(selector){
    return document.querySelector(selector) ; 
}
function qsa(selector){
    return document.querySelectorAll(selector) ; 
}
function id(id){
    return document.getElementById(id) ; 
}