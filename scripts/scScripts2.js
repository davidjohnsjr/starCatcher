// StarCatcher Scripts for the game made by Soft Dev 2015
    // when the web page window loads up, the game scripts will be read

var starCount=20;
var counter =0;
window.onload = function() {
    var star = {
        _x: null,
        _y: null,
        _xSpeed: null,
        _ySpeed: null,
        _visible: true,

        //Create new star object with given starting position and speed
        //class functions exist to set other private variables
        //All inputs are double and function returns a new star
        create: function (x, y, xSpeed, ySpeed) {
            var obj = Object.create(this);
            obj._x = x;
            obj._y = y;
            obj._xSpeed = xSpeed;
            obj._ySpeed = ySpeed;
            obj._width = 10;
            obj._height = 10;
            obj._img = new Image();
            obj._img.src = "images/flare.png";
            return obj;
        },
        setSize: function(width, height) {
            this._width += 5;
            this._height += 5;
        },
        setImage: function(img){
            this._img.src=img;
        },
        visible: function() {
            return this._visible;
        },

        //Update the new x and y of the star based on the speed.
        //drawing functionality is left for calling class
        //no input or return
        update: function () {
            this._x+=this._xSpeed;
            this._y+=this._ySpeed;
        },
    };

    var strandedShip = {
        _x: null,
        _y: null,
        _xSpeed: null,
        _ySpeed: null,
        _visible: true,

        //Create new star object with given starting position and speed
        //class functions exist to set other private variables
        //All inputs are double and function returns a new star
        create: function (x, y, xSpeed, ySpeed) {
            var obj = Object.create(this);
            obj._x = x;
            obj._y = y;
            obj._xSpeed = xSpeed;
            obj._ySpeed = ySpeed;
            obj._width = 60;
            obj._height = 60;
            obj._img = new Image();
            obj._img.src = "images/falcon.png";
            return obj;
        },
        setImage: function(img){
            this._img.src=img;
        },
        visible: function() {
            return this._visible;
        },

        //Update the new x and y of the star based on the speed.
        //drawing functionality is left for calling class
        //no input or return
        update: function () {
            this._x+=this._xSpeed;
            this._y+=this._ySpeed;
        },
    }; // close of strandedShip object

    //load canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d"),
        w = canvas.width = 800,
        h = canvas.height = 500;

    //load images
    //player 1
    var whichShip1 = new Image();
    var ship1u = new Image();
    ship1u.src="images/ship1u.png";
    var ship1r = new Image();
    ship1r.src="images/ship1r.png";
    var ship1d = new Image();
    ship1d.src="images/ship1d.png";
    var ship1l = new Image();
    ship1l.src="images/ship1l.png";
    whichShip1 = ship1u;

    // player 2
    var whichShip2 = new Image();
    var ship2u = new Image();
    ship2u.src="images/spaceship1u.png";
    var ship2r = new Image();
    ship2r.src="images/spaceship1r.png";
    var ship2d = new Image();
    ship2d.src="images/spaceship1d.png";
    var ship2l = new Image();
    ship2l.src="images/spaceship1l.png";
    whichShip2 = ship2u;

    var ship2 = new Image();
    ship2.src="images/spaceship2.png";
    var background = new Image();
    background.src="images/bg.jpg";

// our stars are created using a single array with a class of information
    
    var starArray=[];

    var strandedShipCount = 6;
    var strandedShipArray = [];
    var chewyTotal = 0;

    // Create an array of stars
    for (var i = 0; i < starCount; i++) {
        // this assigns each element in the array all the information for the star by 
        // using the 'star' class, pass the starting x,y locations 
        //  and speeds into the array.
        starArray.push(star.create(20,i+50,3-Math.random()*6,2-Math.random()*5));
    }
    // Create an array of stranded ships
    for (var i = 0; i < strandedShipCount; i++) {
        // this assigns each element in the array all the information for the star by 
        // using the 'star' class, pass the starting x,y locations 
        //  and speeds into the array.
        strandedShipArray.push(strandedShip.create(20,i+150,3-Math.random()*6,2-Math.random()*5));
    }

    // moving stars around the screen 
    var p1x=w/2+100, p1y=h/2, p2x=w/2-100, p2y=h/2;
    var gameOn = true;
    var p1Score =0, p2Score = 0;
    var explode = new Audio('sounds/explosion.mp3');
    var chewy = new Audio('sounds/chewy.mp3');
    var bgmusic = new Audio('sounds/roar.mp3');
    bgmusic.volume=.3;
    bgmusic.play();
    
    
    // moving stars around the screen and update the players movement

    function starsUpdate () {
               
    //  draw star on screen only if visible
        for (var i = 0; i < starCount; i++) {
            starArray[i].update();
            if (starArray[i].visible()) {
                ctx.drawImage(starArray[i]._img, starArray[i]._x-starArray[i]._width/2, starArray[i]._y-starArray[i]._height/2, starArray[i]._width, starArray[i]._height);
            }
            if (starArray[i]._x>w) {starArray[i]._x = 0 }
            if (starArray[i]._x<0) {starArray[i]._x = w }
            if (starArray[i]._y>h || starArray[i]._y<0) {starArray[i]._ySpeed = -starArray[i]._ySpeed}

            var d1=Math.sqrt(Math.pow(p1x-starArray[i]._x,2)+Math.pow(p1y-starArray[i]._y,2));
            var d2=Math.sqrt(Math.pow(p2x-starArray[i]._x,2)+Math.pow(p2y-starArray[i]._y,2));
            if (d1<20) {scoring(i,1)}
            if (d2<20) {scoring(i,2)}
        }//endFor

    }  // close of starsUpdate

//  scoring functions to place and score stars
    function scoring(k,wp) {
        starArray[k]._visible=false;
        if (wp==1) {
            // need to place a small star next to player 1 score
            p1Score-=5;
            $("#p1ScoreDisp").text(p1Score);
            starArray[k]._x = w +200;
            starArray[k]._xSpeed = 0;
            explode.play();
        }
        else if (wp==2) {
            p2Score-=5;
            $("#p2ScoreDisp").text(p2Score);
            starArray[k]._x = w +200;
            starArray[k]._xSpeed = 0;
            explode.play();
        }
    } // end scoring function

    // play on first .9 seconds of an audio by checking
    // setInterval every 10 clicks. 
    function playInterval (audioObj) {
        audioObj.currentTime = 0;
        audioObj.play();
        int = setInterval(function() {
            console.log(audioObj.currentTime);
            if (audioObj.currentTime > 0.9) {
                audioObj.pause();
                clearInterval(int);  //stops running interval
            }
        }, 10);
    }   // close playInterval

    function strandedShipUpdate () {
               
    //  draw strandedShip on screen only if visible
        for (var i = 0; i < strandedShipCount; i++) {
            strandedShipArray[i].update();
            if (strandedShipArray[i].visible()) {
                // save the canvas, move canvas to ship location, rotate canvas and draw ship, restore canvas
                ctx.save();
                ctx.translate(strandedShipArray[i]._x,strandedShipArray[i]._y);
                ctx.rotate(counter*Math.PI/180);
                ctx.drawImage(strandedShipArray[i]._img, -strandedShipArray[i]._width/2, -strandedShipArray[i]._height/2, strandedShipArray[i]._width, strandedShipArray[i]._height);
                ctx.restore();
            }
            if (strandedShipArray[i]._x>w) {strandedShipArray[i]._x = 0 }
            if (strandedShipArray[i]._x<0) {strandedShipArray[i]._x = w }
            if (strandedShipArray[i]._y>h || strandedShipArray[i]._y<0) {strandedShipArray[i]._ySpeed = -strandedShipArray[i]._ySpeed}

            if (Math.abs(p1x-strandedShipArray[i]._x)<20 & Math.abs(p1y-strandedShipArray[i]._y)<20) {
                playInterval(chewy);
                strandedShipArray[i]._visible = false;
                p1Score = p1Score +10;
                strandedShipArray[i]._x = w+200;
                strandedShipArray[i]._xSpeed = 0;
                $("#p1ScoreDisp").text(p1Score);  
                chewyTotal ++
            }
            if (Math.abs(p2x-strandedShipArray[i]._x)<20 & Math.abs(p2y-strandedShipArray[i]._y)<20) {
                playInterval(chewy);
                strandedShipArray[i]._visible = false;
                p2Score = p2Score +10;
                $("#p2ScoreDisp").text(p2Score);
                strandedShipArray[i]._x = w+200;
                strandedShipArray[i]._xSpeed = 0;
                chewyTotal ++

            }
            if (chewyTotal==strandedShipCount) {
                    if (p1Score>p2Score) {alert("Player 1 has won.")}
                    else if (p1Score<p2Score) {alert("Player 2 has won.")}
                    else {alert("tie... ugh. ")}
                    window.location="index.html";
            }
        }//endFor

    }  // close of strandedShip Update
        
    // a new array is made to keep track of a button being held down
    var keysDown = [];

    // if the key is held down, the keycode is placed in array
    // then it is deleted upon keyup command.  
    // playerUpdate will now control player movements and use the keysDown array

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        if (e.keyCode == 87) {
            whichShip2 = ship2u;
        }
        if (e.keyCode == 83) {
            whichShip2 = ship2d;
        }
        if (e.keyCode == 65) {
            whichShip2 = ship2l;
        }
        if (e.keyCode == 68) {
            whichShip2 = ship2r;
        }

        if (e.keyCode == 38) {
            whichShip1 = ship1u;
        }
        if (e.keyCode == 40) {
            whichShip1 = ship1d;
        }
        if (e.keyCode == 37) {
            whichShip1 = ship1l;
        }
        if (e.keyCode == 39) {
            whichShip1 = ship1r;
        }

    }, false);

        //  player movement keyboard commands
    addEventListener("keyup", function (e) {
        // start the game with keyboard command
        if (e.keyCode == 32) {
            if (gameOn) {gameOn=!gameOn}
            else {
                gameOn=!gameOn;
                main();}
        }//end if

        //take keycode out of array (not being held down anymore)
        delete keysDown[e.keyCode];
    }, false); 

 //player movement
    function playerUpdate() {
        //player two hodling down a key using the array keysDown
        if (87 in keysDown) {// P2 holding down the w key
            p2y -= 5;
        }
        if (83 in keysDown) { // P2 holding down (key: s)
            p2y += 5;
        }
        if (65 in keysDown) { // P2 holding down (key: a)
            p2x -= 5;
        }
        if (68 in keysDown) { // P2 holding down (key: d)
            p2x += 5;
        }

        // player one hodling key down
        if (37 in keysDown) { // P1 holding down (key: left arrow)
            p1x -= 5;
        }
        if (38 in keysDown) { // P1 holding down (key: up arrow)
            p1y -= 5;
        }
        if (39 in keysDown) { // P1 holding down (key: right arrow)
            p1x += 5;
        }
        if (40 in keysDown) { // P1 holding down (key: down arrow)
            p1y += 5;
        }
        //draw images of ships
        if (p1x>w) {p1x = 0}
        if (p1x<0) {p1x = w}
        if (p1y>h) {p1y = 0}
        if (p1y<0) {p1y = h}
        if (p2x>w) {p2x = w-10}
        if (p2x<0) {p2x = 10}
        if (p2y>h) {p2y = h-10}
        if (p2y<0) {p2y = 10}
        ctx.drawImage(whichShip1, p1x-30, p1y-30, 60, 60);
        ctx.drawImage(whichShip2, p2x-30, p2y-30, 60, 60);
    }  // close playerUpdate

       //Our main function which clears the screens 
    //  and redraws it all again through function updates,
    //  then calls itself out again
    function main(){
        counter ++;
        ctx.clearRect(0,0,w,h);
        ctx.globalAlpha = .3;
        ctx.drawImage(background,0,0,w,h);
        ctx.globalAlpha = 1;
        starsUpdate();
        strandedShipUpdate();
        playerUpdate();
        if (gameOn==1) {requestAnimationFrame(main);}
    }
    main();        
} // close   window onload             
                