
//игровое поле, игровой процесс
var canvas;
var context;
var width = getWindowClientSize().width;
var height = getWindowClientSize().height;
var playing;
var playerName;
var clickAudio = new Audio("music.mp3");
var gameEnd;
var gameEndRes;
//координаты мыши
var mouseX;
var mouseY;
//подписываемся на события
window.addEventListener('resize', resizing, false);
window.addEventListener('orientationchange', resizing, false);
document.addEventListener('mousemove', mouseMove, false);
document.addEventListener('keydown', keyDown, false);
document.addEventListener('touchstart', touchStart, false);
document.addEventListener('touchmove', touchMove, false);
 

//обработка событий
function mouseMove(eo) {
	mouseX = eo.clientX;
	mouseY = eo.clientY;
}
function keyDown(eo) {
        eo = eo || window.event;

        switch (eo.keyCode) {
            case 37:
                mouseX -= 5;
                mouseY += 5;
                eo.preventDefault();
                break;
            case 38:
                mouseY -= 5;
                mouseX -= 5;
                eo.preventDefault();
                break;
            case 39:
                mouseX += 5;
                mouseY -= 5;
                eo.preventDefault();
                break;
            case 40:
                mouseY += 5;
                mouseX += 5;
                eo.preventDefault();
                break;
        }
    }
function touchStart(touchEvent) {
        if (touchEvent.touches.length == 1) {
            event.preventDefault();
            mouseX = touchEvent.touches[0].clientX;
            mouseY = touchEvent.touches[0].clientY;
        }
    }
function touchMove(touchEvent) {
        if (event.touches.length == 1) {
           mouseX = touchEvent.touches[0].clientX;
           mouseY = touchEvent.touches[0].clientY;
        }
    }

//создаем нужные ДОМ-элементы
var scoreText = document.getElementById('score');
var timeText = document.getElementById('time');
var healthText = document.getElementById('health');
//задаем основные элементы игры
var player;
var balls = [];
var greenades = [];
var explosions = [];
var lives = [];
var timer;
var score;
var a;
var ballsColorsArray = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];
var greebadeColorsArray = ['#b62020', '#cb2424', '#fe2e2e', '#fe5757', '#fe8181'];
var time;
var nowTime;
var viewTime;

//задаем классы объектов
function Player() {
		this.position = {x: 0, y: 0};
		this.health = 1;
		this.radius = 5;
		this.greenade = 0;
		this.live = 0;
	}

function Ball() {
		var colorBall = null;
		this.position = {x: 0, y: 0};
		this.speed = {speedX: Math.random()*3-4, speedY: Math.random()*2+2};
		this.radius = Math.random()*20+5;
		this.color = getBallColor(ballsColorsArray);
	}
function Explosion() {
		this.position = {x: 0, y: 0};
		this.speed = {speedX: Math.random()*2-1, speedY: Math.random()*2+2};
		this.radius = 0.5;
}
function Greenade() {
		this.position = {x: 0, y: 0};
		this.speed = {speedX: Math.random()*3-4, speedY: Math.random()*2+2};
		this.radius = 15;
}
function Live() {
		this.position = {x: 0, y: 0};
		this.speed = {speedX: Math.random()*3-4, speedY: Math.random()*2+2};
		this.size = 15;
}

//функция создания нового элемента
function getElementEnterData (elem) {
		elem.position.x = Math.random()*canvas.width+canvas.width/3;
		elem.position.y = -30;
		return elem;
	}
//функция вычисления расстояния между элементами игры
function getDistanceBetween (elemOne, elemTwo) {
		var dX = elemOne.position.x - elemTwo.position.x;
		var dY = elemOne.position.y - elemTwo.position.y;
		var distance = Math.sqrt(dX*dX+dY*dY);
		return distance; 
	}
//функция распространения взрыва
function makeExplosion (elem) {
	var quantity = Math.random()*elem.radius+2;
	for(var k = 1; k<=quantity; k++){
		var angle = Math.random()*360;
		var exp = new Explosion();
		exp.position.x = elem.position.x + Math.sin(angle)*15;
		exp.position.y = elem.position.y + Math.cos(angle)*15;
	explosions.push(exp);
	}
}
//функция выбора нужного цвета
function getBallColor(array) {
			var colorsArray = array;
			var colorNumber = Math.floor(Math.random()*(5-1+1))+1
			var colorBall = colorsArray[colorNumber];
			return colorBall;
		}
//функция правильного округления
function getRounding(number) {
	if (number>0) {
		number = Math.round(number*100)/100;
	}
	else {
		number = Math.round(number);
	}
return number
}

//Начинаем игру
function gameStart() {
	//находим нужные ДОМ-элементы
	canvas = document.getElementById('canvas');
	playerName = document.getElementById('playerName').value;
	context = canvas.getContext('2d');
	canvas.width = width;
 	canvas.height = height;
 	gameEnd = document.getElementById('gameEnd');
	gameEndRes = document.getElementById('gameEndRes');
	gameEndRes.innerHTML = '';
	gameEnd.style.display = 'none'
 	//обновляем основные элементы игры
 	playing = true;
	player = new Player;
	balls = [];
	greenades = [];
	explosions = [];
	lives = [];
	timer = 0;
	score = 0;
	a = 0;
	time = new Date().getTime();
	//запускаем
	audioOn()
	gameLoop();
}
//функция непосредственно игры
function upload() {
	var nowTime = new Date().getTime();
	viewTime = Math.round((nowTime - time) / 1000);
	score+=0.006;
	//ИГРОК
	player.position.x = mouseX;
	player.position.y = mouseY;

	//ШАРЫ
	//добавляем новый шар
	if(timer%5 == 0) {
		balls.push(getElementEnterData(new Ball()));
	}
	timer++;
	for ( i in balls) {
		//обработка поведения шаров и результатов
		b = balls[i];
		b.position.x = b.position.x + b.speed.speedX;
		b.position.y = b.position.y + b.speed.speedY;

		//если шар сталкивается с игроком
		var distance = getDistanceBetween(b, player);
	    if (distance <= player.radius+b.radius) {
	    	if(player.health>0) {
		    	makeExplosion(b);
		    	vibro(true);
				balls.splice(i, 1);
				player.health -= 0.5;
				i--;
	    	}
	    	else{
	    		makeExplosion(player);
	    	}
		}

		//если шар выходит за границу игрового поля
		if(b.position.x<0 || b.position.y>canvas.height) {
			balls.splice(i, 1);
			i--;
		}
	}
	//Гранаты
	if (!greenades.length && Math.random() > 0.8) {
		greenades.push(getElementEnterData(new Greenade()));
	} 
	for (i in greenades) {
		g = greenades[i];
		g.position.x = g.position.x + g.speed.speedX;
		g.position.y = g.position.y + g.speed.speedY;
		
		//если граната сталкивается с игроком
		var distance = getDistanceBetween(g, player);
		if (distance <= player.radius+g.radius) {
			vibro(false);
			player.greenade = 1;
			greenades.splice(i, 1);
			i--;
			score +=30;

			//проверяем наличие шаров рядом 
			for (k in balls) {
				b = balls[k];
				var distance = getDistanceBetween(b, player);
	   			 if (distance < 200) {
					makeExplosion(b);
					balls.splice(k, 1);
					k--;
				}
			}
		}
		//если граната выходит за границу игрового поля
		if(g.position.x<0 || g.position.y>canvas.height) {
			greenades.splice(i, 1);
			i--;
		}
	}
	//Жизни

	if (!lives.length && Math.random() > 0.8) {
		lives.push(getElementEnterData(new Live()));
	} 
	for (i in lives) {
		li = lives[i];
		li.position.x = li.position.x + li.speed.speedX;
		li.position.y = li.position.y + li.speed.speedY;
		
		//если жизнь сталкивается с игроком
		var distance = getDistanceBetween(li, player);
		if (distance <= player.radius+li.size) {
			vibro(false);
			player.health +=0.2;
			lives.splice(i, 1);
			i--;
			score +=20;

			//проверяем наличие шаров рядом 
			for (k in balls) {
				b = balls[k];
				var distance = getDistanceBetween(b, player);
	   			 if (distance < 100) {
					makeExplosion(b);
					balls.splice(k, 1);
					k--;
				}
			}
		}
		//если жизнь выходит за границу игрового поля
		if(li.position.x<0 || li.position.y>canvas.height) {
			lives.splice(i, 1);
			i--;
		}
	}

	//Частички от взрыва
	for(i in explosions) {
		e = explosions[i];
		e.position.x = e.position.x + e.speed.speedX;
		e.position.y = e.position.y + e.speed.speedY;

		if(e.position.x<0 || e.position.y>canvas.height) {
			explosions.splice(i, 1);
			i--;
		}
	}
	if(player.health<=0) {
		vibro(true);
		gameOver();
	}
}

//функция отрисовки игры
function render() {
	timeText.innerHTML = 'Time: ' + viewTime;
	scoreText.innerHTML = 'Score: ' + Math.round(score);
	healthText.innerHTML = 'Health: ' + getRounding(player.health);
	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width, canvas.height);
	//отрисовываем игрока
	context.beginPath();
		context.fillStyle='yellow';
		context.shadowColor = 'yellow';
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 10;
		context.arc(player.position.x, player.position.y, player.radius, 0, Math.PI*2, false);
	 context.fill();
	
	//отрисовываем шары
	for ( i in balls) {
		b = balls[i];
		context.beginPath();
		context.fillStyle = b.color;
		context.shadowBlur = 0;
		context.arc(b.position.x, b.position.y, b.radius, 0, Math.PI*2, false);
	    context.fill();
	}
	//отрисовываем гранаты
	for (i in greenades) {
		g = greenades[i];
		context.beginPath();
		context.fillStyle=getBallColor(greebadeColorsArray);
		context.arc(g.position.x, g.position.y, g.radius, 0, Math.PI*2, false);
	    context.fill();
	}
	context.save();
	//отрисовываем жизни
	for (i in lives) {
		l = lives[i];
		var dx = l.position.x + l.size/2;
		var dy = l.position.y + l.size/2;
		an = a*(Math.PI / 180);
		context.translate(dx,dy);
		context.rotate(an);
		context.translate(-dx, -dy);
		context.fillStyle = '#adff00';
		context.fillRect(l.position.x, l.position.y, l.size, l.size);
	    context.resetTransform();
		a++;
	};
	//отрисовываем взрыв
	for (i in explosions) {
		e = explosions[i];
		context.beginPath();
		context.fillStyle='#fff5ee';
		context.arc(e.position.x, e.position.y, e.radius, 0, Math.PI*2, false);
	    context.fill();
	}
	}

//Игровой цикл
function gameLoop() {
	upload();
	render();
	if(playing){
		nextGameStep(gameLoop);
	}
}

//Заканчиваем игру
function gameOver() {
	playing = false;
	sendRecords();
	gameEnd.style.display = 'block';
	gameEndRes.innerHTML = 'Вы набрали '+Math.round(score)+'!'
	
	
}
//Прерываем игру
function gameBreak(){
	playing = false;
}
var nextGameStep = (function (){
	return requestAnimationFrame ||
	webkitRequestAnimationFrame ||
	mozRequestAnimationFrame ||
	oRequestAnimationFrame ||
	msRequestAnimationFrame ||
	function(callback) {
		window.setTimeOut(callback, 1000/60);
	};
})();

function getWindowClientSize() {
  var uaB=navigator.userAgent.toLowerCase();
  var isOperaB = (uaB.indexOf('opera')  > -1);
  var isIEB=(!isOperaB && uaB.indexOf('msie') > -1);

  var clientWidth=((document.compatMode||isIEB)&&!isOperaB)?
    (document.compatMode=='CSS1Compat')?
    document.documentElement.clientWidth:
    document.body.clientWidth:
    (document.parentWindow||document.defaultView).innerWidth;

  var clientHeight=((document.compatMode||isIEB)&&!isOperaB)?
    (document.compatMode=='CSS1Compat')?
    document.documentElement.clientHeight:
    document.body.clientHeight:
    (document.parentWindow||document.defaultView).innerHeight;

  return {width:clientWidth, height:clientHeight};
}
function resizing() {
	width = getWindowClientSize().width;
	height = getWindowClientSize().height;
	canvas.width = width-10;
	canvas.height = height-10;
}

function audioOn() {
        clickAudio.play();
}
function audioOff() {
        clickAudio.pause();
        clickAudio.currentTime = 0; // и сразу останавливаем
}
function vibro(longFlag) {
        if ( navigator.vibrate ) { // есть поддержка Vibration API?
            if ( !longFlag )
                window.navigator.vibrate(100); // вибрация 100мс
            else
                window.navigator.vibrate([100,50,100,50,100]); // вибрация 3 раза по 100мс с паузами 50мс
        }
}




