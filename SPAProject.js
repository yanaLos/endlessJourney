window.onhashchange=switchToStateFromURLHash
var SPAState={};

function switchToStateFromURLHash() {
    var URLHash=window.location.hash;

    var stateJSON=decodeURIComponent(URLHash.substr(1));

    if( stateJSON!=""){
      SPAState=JSON.parse(stateJSON); 
    }
    else {
      SPAState={pagename:'Menu'}; 
    }

    console.log('Новое состояние приложения:');
    console.log(SPAState);
    var menu = document.getElementById('menu');
    var game = document.getElementById('game');
    var table = document.getElementById('table');
    
    switch ( SPAState.pagename ) {
      case 'Menu':
        menu.style.display = 'inline-block';
        game.style.display = 'none';
        table.style.display = 'none';
        audioOff();
        gameBreak();
        break;
      case 'Game':
        menu.style.display = 'none';
       	game.style.display = 'block';
        table.style.display = 'none';
        gameStart();
        break;
      case 'Records':
        menu.style.display = 'none';
       	game.style.display = 'none';
       	table.style.display = 'inline-block';
       	refreshRecords();
    	audioOff();
        break;
    }
  }
   function switchToState(newState) {
    location.hash=encodeURIComponent(JSON.stringify(newState));
  }

  function switchToMenuPage() {
    switchToState( { pagename:'Menu' } );
  }

  function switchToGamePage() {
    switchToState( { pagename:'Game'} );
  }

  function switchToResultsPage() {
    switchToState( { pagename:'Records'} );
  }

window.onbeforeunload = beforeUnload;
var message = 'В случае перезагрузки страницы ваша игра будет потеряна';
function beforeUnload(eo) {
    eo=eo || window.event;
    if (playing) {
        eo.returnValue = message;
        return message;
    }
}

  // переключаемся в состояние, которое сейчас прописано в закладке УРЛ
  switchToStateFromURLHash();

 

