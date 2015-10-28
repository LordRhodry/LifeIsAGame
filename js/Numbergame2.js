

jQuery(function($){
	function getParameterByName(name) {
    		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
   		 var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        	results = regex.exec(location.search);
    		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	var lev =  1;
	if (getParameterByName('level')) lev =getParameterByName('level') ;
	lev --;
	var score = 0;
	var scored=[];
	var grid=[];
	var oldGrid=[];
	var moveLogs=[];
	var colors=[,"Red","Blue","Teal","Purple","Orange","Green","Pink","Grey","LightBlue","DarkGreen","Brown"];
	var colorCodes =[];
	console.log(lev);
	var ruleOp=Math.floor(lev / 3); // 0=> add , 1=> mult , 2 => sub , 3=> div
	var ruleValue = (lev) % 3 +2 ;
	var startingVal=[];
	var drawit;
	var drawit2;
	var drawit3;
	var won =0;
	var istest = 0;
	var board = document.getElementById("gameCanvas");
		var boardsize = Math.min(board.width,board.height);
		
		var marginsize = Math.floor(boardsize /21);
		var cellsize = Math.floor((boardsize - (5*marginsize)) / 4);
	var framerate = Math.floor(1000 /64);
		switch(ruleOp)
		{
		case 0:
			var startingVal = [1,1,1,1+ruleValue,1+ruleValue,1+ruleValue,1+ruleValue];
			document.getElementById("rules").innerHTML="The rule today is: __ + "+ruleValue +" = __. <br> You win if you manage to create a tile showing : "+(ruleValue*11+1);
			break;
		case 1:
			var startingVal = [1,1,1,ruleValue,ruleValue,ruleValue,ruleValue];
			document.getElementById("rules").innerHTML="The rule today is: __ X "+ruleValue +" = __. <br>You win if you manage to create a tile showing : "+Math.pow(ruleValue, 11) ;
			break;
		case 2:
			var startingVal = [ruleValue*11+1,ruleValue*11+1,ruleValue*11+1,ruleValue*10+1,ruleValue*10+1,ruleValue*10+1,ruleValue*10+1];
			document.getElementById("rules").innerHTML="The rule today is: __ - "+ruleValue +" = __. <br>You win if you manage to create a tile showing : 1.";
			break;
		case 3:
			var temp = Math.pow(ruleValue, 11);
			var startingVal = [temp,temp,temp,temp/ ruleValue,temp / ruleValue,temp / ruleValue,temp / ruleValue];
			document.getElementById("rules").innerHTML="The rule today is: __ / "+ruleValue +" = __. <br>You win if you manage to create a tile showing : 1."  ;
			break;
		default :
			alert("Something unexpected happened, please reload the page.");
		}
		
		document.onkeydown = function( ev )
        {
			switch ( ev.keyCode )
			{
				case 37: moveBlock( 0 ); return false;      // left
				case 38: moveBlock( 2 ); return false;      // up
				case 39: moveBlock( 1 ); return false;      // right
				case 40: moveBlock( 3 ); return false;      // down
			}
		}
			
		document.addEventListener('touchstart', handleTouchStart, false);        
		document.addEventListener('touchmove', handleTouchMove, false);

		var xDown = null;                                                        
		var yDown = null;                                                        

		function handleTouchStart(evt)
		{                                         
			xDown = evt.touches[0].clientX;                                      
			yDown = evt.touches[0].clientY;                                      
		};                                                

		function handleTouchMove(evt) 
		{
			if ( ! xDown || ! yDown ) {
				return;
			}

			var xUp = evt.touches[0].clientX;                                    
			var yUp = evt.touches[0].clientY;

			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;

			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
				if ( xDiff > 0 ) {
					moveBlock( 0 );/* left swipe */ 
				} else {
					moveBlock( 1 )/* right swipe */
				}                       
			} else {
				if ( yDiff > 0 ) {
					moveBlock( 2 )/* up swipe */ 
				} else { 
					moveBlock( 3 )/* down swipe */
				}                                                                 
			}
				/* reset values */
				xDown = null;
				yDown = null;                                             
		};	


	function gamestart()
	{
		
		score = 0;

	
		var x1 = Math.floor(Math.random()*4);
		var y1= Math.floor(Math.random()*4);
		var x2 = Math.floor(Math.random()*4);
		if (x2 != x1 )
		{
			var y2 = Math.floor(Math.random()*4);
		}
		else
		{
			var y2 = Math.floor(Math.random()*4);
			while (y2 == y1)
			{
				y2 = Math.floor(Math.random()*4);
			}
		}
		var startValue1 =  startingVal[Math.floor(Math.random()*startingVal.length)];
		var startValue2 =  startingVal[Math.floor(Math.random()*startingVal.length)];
		prepColor();
	
		for(var i=0 ; i<4 ; i++)
		{
			grid[i]=[];
			for(var j=0 ; j<4 ; j++)
			{
				if ((i==x1)&&(j==y1))
				{
					grid[i][j]=startValue1;
				}
				else if ((i==x2)&&(j==y2))
				{
					grid[i][j]=startValue2;
				}
				else
				{
					grid[i][j]=0;
				}
			}
		}
		oldGrid = grid;
		moveLogs=[[],[],[],[]];
		drawGame(0);
		document.getElementById("myscore").value = score;
	}

	// direction will be 0=> left , 1=> right , 2 => up , 3=> down
	function moveBlock( direction)
	{
		if (drawit)
		{
			cancelAnimationFrame(drawit);
		}
		if (drawit2)
		{
			cancelAnimationFrame(drawit2);
		}
		if (drawit3)
		{
			cancelAnimationFrame(drawit3);
		}
	
		var posx =0;
		var posy =0;
		var success = 0;
		var action =0;
		scored =[];
		moveLogs =[[],[],[],[]];
		oldGrid = [[],[],[],[]];
		for (var i=0;i<4; i++)
		{
			for (var j=0; j<4; j++)
			{
				oldGrid[i][j]=grid[i][j];
			}
		
		}
		switch (direction)
		{
		case 0:
			for (var i=0; i<4 ; i++)
			{	
				posx=0;
				while (posx<4)
				{
					if (grid[posx][i] == 0)
					{
						success = moveLeft(i,posx);
						action = Math.max(action, success);
						posx++;
						if (success == 0)
						{
							posx =4;
						}
					}
					else
					{
						posx++;
					}
				}
				success = fuseLeft(i);
				action = Math.max(action, success);
				if (success == 1);
				{
					posx=0;
					while (posx<4)
					{
						if (grid[posx][i] == 0)
						{
							success = moveLeft(i,posx);
							posx++;
							if (success == 0)
							{
								posx =4;
							}
						}
						else
						{
							posx++;
						}
					}			
				}
			}
			break;
		case 1:
			for (var i=0; i<4 ; i++)
			{	
				posx=3;
				while (posx>-1)
				{
					if (grid[posx][i] == 0)
					{
						success = moveRight(i,posx);
						action = Math.max(action, success);
						posx--;
						if (success == 0)
						{
							posx =-1;
						}
					}
					else
					{
						posx--;
					}
				}
				success = fuseRight(i);
				action = Math.max(action, success);
				if (success == 1);
				{
					posx=3;
					while (posx>-1)
					{
						if (grid[posx][i] == 0)
						{
							success = moveRight(i,posx);
							posx--;
							if (success == 0)
							{
								posx =-1;
							}
						}
						else
						{
							posx--;
						}
					}			
				}
			}
			break;
		case 2:
			for (var i=0; i<4 ; i++)
			{	
				posy=0;
				while (posy<4)
				{
					if (grid[i][posy] == 0)
					{
						success = moveUp(i,posy);
						action = Math.max(action, success);
						posy++;
						if (success == 0)
						{
							posy =4;
						}
					}
					else
					{
						posy++;
					}
				}
				success = fuseUp(i);
				action = Math.max(action, success);
				if (success == 1);
				{
					posy=0;
					while (posy<4)
					{
						if (grid[i][posy] == 0)
						{
							success = moveUp(i,posy);
							posy++;
							if (success == 0)
							{
								posy =4;
							}
						}
						else
						{
							posy++;
						}
					}			
				}
			}
			break;
		case 3:
			for (var i=0; i<4 ; i++)
			{	
				posy=3;
				while (posy>-1)
				{
					if(grid[i][posy] == 0)
					{
						success = moveDown(i,posy);
						action = Math.max(action, success);
						posy--;
						if (success == 0)
						{
							posy =-1;
						}
					}
					else
					{
						posy--;
					}
				}
				success = fuseDown(i);
				action = Math.max(action, success);
				if (success == 1);
				{
					posy=3;
					while (posy>-1)
					{
						if(grid[i][posy] == 0)
						{
							success = moveDown(i,posy);
							posy++;
							if (success == 0)
							{
								posy =-1;
							}
						}
						else
						{
							posy--;
						}
					}			
				}
			}
			break;		
		

		}
if (istest ==0){
		var emptyArray = findEmpty();
		var emptylength = emptyArray.length;
		
		if (emptylength == 0)
		{
			testover = isOver();
			if (testover == 0)
			{ 			
				$("#dialog").dialog('open');
			}
		}
		else if (action == 0)
		{
			return;
		}
		else 
		{
			var vall = balance();
			if (vall == -1)			
			{
				var randnumber = startingVal[Math.floor(Math.random()*startingVal.length)];
			}
			else
			{
				var randnumber = startingVal[vall];
			}
			var randpick = Math.floor(Math.random()*emptylength);
			grid[emptyArray[randpick][0]][emptyArray[randpick][1]] = randnumber;

		drawGame(direction);
		document.getElementById("myscore").value = score;
		}
	}
		return;
	}
	function balance()
	{
		var stv1 = startingVal[0];
		var stv2 = startingVal[startingVal.length  -1];
		var stv1count = 0;
		var stv2count = 0;
		for (var i=0; i< grid.length ; i++)
		{
			for (var j=0 ; j < grid[i].length ; j++)
			{		
				if (grid[i][j] == stv1) 
				{
					stv1count++;
				}
				if (grid[i][j] == stv2) 
				{
					stv2count++;
				}
			}
		}
		if (Math.abs(stv1count - stv2count)<3)
		{
			return -1;
		}
		if (stv1count <stv2count)
		{
			return 0;
		}
		return startingVal.length -1;
	}

	function isOver(){
		var moveex =0;
		var savedoldgrid = [];
		var savedgrid = [];
		for (var i=0; i< 4; i++)
		{
			savedoldgrid[i]=[];
			savedgrid[i]=[];
			for (var j=0; j<4; j++)
			{
				savedoldgrid[i][j]=oldGrid[i][j];
				savedgrid[i][j]=grid[i][j];
			} 
		}
		istest = 1;
		for (var direct = 0 ; direct < 4 ; direct ++)
		{
			for (var i=0; i< 4; i++)
			{
				for (var j=0; j<4; j++)
				{
				oldGrid[i][j] = savedoldgrid[i][j];
				grid[i][j] = savedgrid[i][j];
				} 
			}
			moveBlock( direct);
			var emptyArray = findEmpty();
			console.log(emptyArray.length);
			moveex += emptyArray.length;
		}
			for (var i=0; i< 4; i++)
			{
				for (var j=0; j<4; j++)
				{
				oldGrid[i][j] = savedoldgrid[i][j];
				grid[i][j] = savedgrid[i][j];
				} 
			}
		istest =0;
		return moveex;


	}
	function moveUp (col, line)
	{
		var done = 0;
		var high = line+1;
		while ((high<4)&&(grid[col][high] == 0))
		{	
			high ++;
		}
		if (high == 4)
		{
			return 0;
		}
		else
		{
			grid[col][line] = grid[col][high];
			grid[col][high]=0;
			moveLogs[2][moveLogs[2].length] = {"x":col,"y":high};
			return 1;
		}
	}

	function moveLeft (line , col)
	{
		var done = 0;
		var left = col+1;
		while ((left<4)&&(grid[left][line] == 0))
		{	
			left ++;
		}
		if (left == 4)
		{
			return 0;
		}
		else
		{
			grid[col][line] = grid[left][line];
			moveLogs[0][moveLogs[0].length] = {"x":left,"y":line};
			grid[left][line]=0;
			return 1;
		}
	}

	function moveRight (line , col)
	{
		var done = 0;
		var left = col-1;
		while ((left>-1)&&(grid[left][line] == 0))
		{	
			left --;
		}
		if (left == -1)
		{
			return 0;
		}
		else
		{
			grid[col][line] = grid[left][line];
			moveLogs[1][moveLogs[1].length] = {"x":left,"y":line};
			grid[left][line]=0;
			return 1;
		}
	}

	function moveDown(col, line)
	{
		var done = 0;
		var high = line-1;
		while ((high>-1)&&(grid[col][high] == 0))
		{	
			high --;
		}
		if (high == -1)
		{
			return 0;
		}
		else
		{
			grid[col][line] = grid[col][high];
			if (oldGrid[col][high] != 0)
			{
			moveLogs[3][moveLogs[3].length] = {"x":col,"y":high};
			}
			grid[col][high]=0;
			return 1;
		}
	}

	function fuseUp(col)
	{
		var high =0;
		var found = 0;
		while (high < 3)
		{
			if (grid[col][high] == 0)
			{
				high = 4;
			}
			else if (grid[col][high] == gameOp(grid[col][high+1],0,0,1))
			{
				grid[col][high] = gameOp(grid[col][high], col, high, istest);
				grid[col][high +1] = 0;
				if (oldGrid[col][high+1] != 0)
				{
					moveLogs[2][moveLogs[2].length] = {"x":col,"y":high+1};
				}
				high += 2;
				found = 1;
			}
			else if (grid[col][high+1] == gameOp(grid[col][high],0,0,1))
			{
				grid[col][high] = gameOp(grid[col][high+1], col, high, istest);
				grid[col][high +1] = 0;
				if (oldGrid[col][high+1] != 0)
				{
					moveLogs[2][moveLogs[2].length] = {"x":col,"y":high+1};
				}
				high += 2;
				found = 1;
			}
			else
			{
				high ++;
			}
		}
		return found;
	}

	function fuseLeft(line)
	{
		var left =0;
		var found = 0;
		while (left < 3)
		{
			if (grid[left][line] == 0)
			{
				left = 4;
			}
			else if (grid[left][line] == gameOp(grid[left+1][line],0,0,1))
			{
				grid[left][line] = gameOp(grid[left][line], left, line, istest);
				grid[left+1][line] = 0;
				if (oldGrid[left+1][line] != 0)
				{
					moveLogs[0][moveLogs[0].length] = {"x":left+1,"y":line};
				}
				left += 2;
				found = 1;
			}
			else if (grid[left+1][line] == gameOp(grid[left][line],0,0,1))
			{
				grid[left][line] = gameOp(grid[left+1][line], left, line, istest);
				grid[left+1][line] = 0;
				if (oldGrid[left+1][line] != 0)
				{
					moveLogs[0][moveLogs[0].length] = {"x":left+1,"y":line};
				}
				left += 2;
				found = 1;
			}
			else
			{
				left ++;
			}
		}
		return found;
	}

	function fuseRight(line)
	{
		var left =3;
		var found = 0;
		while (left >0)
		{
			if (grid[left][line] == 0)
			{
				left = 0;
			}
			else if (grid[left][line] == gameOp(grid[left-1][line],0,0,1))
			{
				grid[left][line] = gameOp(grid[left][line], left, line, istest);
				grid[left- 1][line] = 0;
				if (oldGrid[left-1][line] != 0)
				{
					moveLogs[1][moveLogs[1].length] = {"x":left-1,"y":line};
				}
				left -= 2;
				found = 1;
			}
			else if (grid[left-1][line] == gameOp(grid[left][line],0,0,1))
			{
				grid[left][line] = gameOp(grid[left-1][line], left, line, istest);
				grid[left- 1][line] = 0;
				if (oldGrid[left-1][line] != 0)
				{
					moveLogs[1][moveLogs[1].length] = {"x":left-1,"y":line};
				}
				left -= 2;
				found = 1;
			}
			else
			{
				left --;
			}
		}
		return found;
	}

	function fuseDown(col)
	{
		var high =3;
		var found = 0;
		while (high > 0)
		{
			if (grid[col][high] == 0)
			{
				high = -1;
			}
			else if (grid[col][high] == gameOp(grid[col][high-1],0,0,1))
			{
				grid[col][high] = gameOp(grid[col][high], col, high, istest);
				grid[col][high -1] = 0;
				if (oldGrid[col][high-1] != 0)
				{
					moveLogs[3][moveLogs[3].length] = {"x":col,"y":high-1};
				}
				high -= 2;
				found = 1;
			}
			else if((grid[col][high-1] == gameOp(grid[col][high],0,0,1)))
			{
				grid[col][high] = gameOp(grid[col][high-1], col, high, istest);
				grid[col][high -1] = 0;
				if (oldGrid[col][high-1] != 0)
				{
					moveLogs[3][moveLogs[3].length] = {"x":col,"y":high-1};
				}
				high -= 2;
				found = 1;		
			}
			else
			{
				high --;
			}
		}
		return found;
	}

	// for now *2 but will be used to create various games.
	function gameOp( val, xpos, ypos, noScore)
	{
		if (!noScore)
		{
		var ind=scored.length;
		scored[ind]={"x":xpos,"y":ypos,"sc":score};
		}
		switch (ruleOp)
		{
		case 0:
			var result = val + ruleValue;
			if ((result == ruleValue*11 +1)&& (noScore == 0) && (won == 0))
			{
				//alert("Congratuations! You won. You caneep playing to aim at a high score, or you can refresh the page to try yourself at another operation!");
				$("#dialog2").dialog('open');
				won = 1;
			}
			if (!noScore)
			{
			score += result;
			scored[ind].sc = result;
			if (localStorage.bestScoreAdd)
			{
				localStorage.bestScoreAdd = Math.max(localStorage.bestScoreAdd , score);
			}
			else
			{
				localStorage.bestScoreAdd = score;
			}
			document.getElementById('bestscore').value = parseInt(localStorage.bestScoreAdd);
			}
			break;
		case 1:
			var result = val * ruleValue;
			console.log(result);
			if ((result == Math.pow(ruleValue, 11))&& (noScore == 0) && (won == 0))
			{
				//alert("Congratuations! You won. You can keep playing to aim at a high score, or you can refresh the page to try yourself at another operation!");
				$("#dialog2").dialog('open');
				won = 1;			

			}
			if (!noScore)
			{
			score += result;
			scored[ind].sc = result;
			if (localStorage.bestScoreMult)
			{
				localStorage.bestScoreMult = Math.max(localStorage.bestScoreMult , score);
			}
			else
			{
				localStorage.bestScoreMult = score;
			}
			document.getElementById('bestscore').value = parseInt(localStorage.bestScoreMult);
			}
			break;
		case 2:
			var result = val - ruleValue;
			if ((result == (2-1))&& (noScore == 0) && (won == 0))
			{
				//alert("Congratuations! You won. You can keep playing to aim at a high score, or you can refresh the page to try yourself at another operation!");
				$("#dialog2").dialog('open');
				won = 1;
			}
			if (!noScore)
			{
			score += ruleValue*10 - result;
			scored[ind].sc = ruleValue*10 - result;
			if (localStorage.bestScoreSub)
			{
				localStorage.bestScoreSub = Math.max(localStorage.bestScoreSub , score);
			}
			else
			{
				localStorage.bestScoreSub = score;
			}
			document.getElementById('bestscore').value = parseInt(localStorage.bestScoreSub);
			}
			break;
		case 3:
			var result = val / ruleValue;
			if ((result == (2-1))&& (noScore == 0) && (won == 0))
			{
				//alert("Congratuations! You won. You can keep playing to aim at a high score, or you can refresh the page to try yourself at another operation!");
				$("#dialog2").dialog('open');
				won = 1;
			}
			if (!noScore)
			{
			score += Math.pow(ruleValue, 10) / result;
			scored[ind].sc = Math.pow(ruleValue, 10) / result;
			if (localStorage.bestScoreDiv)
			{
				localStorage.bestScoreDiv = Math.max(localStorage.bestScoreDiv , score);
			}
			else
			{
				localStorage.bestScoreDiv = score;
			}
			document.getElementById('bestscore').value = parseInt(localStorage.bestScoreDiv);
			}
			break;
		}
	


		return result;
	}

	function drawGame(direction)
	{
		
		var boardtx = board.getContext("2d");
		if (moveLogs[direction].length >0)
		{
		var offset = 0;
		var timer = 0;
		var timer2 = 0;
		var offset2 = 0;
		var xpos = 0;
		var ypos =0
		var drawit= requestAnimationFrame(function repeatOften(){
				timer ++;				
				offset+= 3*timer;
				for (var logs = 0; logs <moveLogs[direction].length ; logs ++ )
				{
					xpos = moveLogs[direction][logs].x;
					ypos = moveLogs[direction][logs].y;
					//console.log(oldGrid[xpos][ypos]);
					if (oldGrid[xpos][ypos])
					{
					switch (direction)
					{
					case 0:
						drawcell (xpos ,  - offset , ypos , 0 ,3- offset ,0);/*
						boardtx.fillStyle = "#FFFFFF";
						boardtx.fillRect(3+62*xpos - offset + 3, 3 + 62*ypos , 60 , 60);
						if ( colorCodes[oldGrid[xpos][ypos]])
						{
							boardtx.fillStyle = colors[colorCodes[oldGrid[xpos][ypos]]];
						}
						else
						{
							boardtx.fillStyle = "#808080";
						}
					
						boardtx.fillRect(3+62*xpos - offset , 3 + 62*ypos , 60 , 60);
						boardtx.fillStyle = "#FFFFFF";
						boardtx.font = "20px Arial";
						if (oldGrid[xpos][ypos] < 100 )
						{
							boardtx.fillText(oldGrid[xpos][ypos], 26+62*xpos - offset , 37 + 62*ypos);
						}
						else if (oldGrid[xpos][ypos] <1000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 19+62*xpos - offset , 37 + 62*ypos);
						}
						else if (oldGrid[xpos][ypos] <10000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 12+62*xpos - offset , 37 + 62*ypos);
						}
						else
						{
							boardtx.fillText(oldGrid[xpos][ypos], 5+62*xpos - offset , 37 + 62*ypos);
						}*/
						break;
					case 1:
						drawcell (xpos ,  + offset , ypos , 0 ,-3- offset ,0);/*
						boardtx.fillStyle = "#FFFFFF";
						boardtx.fillRect(3+62*xpos + offset -3, 3 + 62*ypos , 60 , 60);
						if ( colorCodes[oldGrid[xpos][ypos]])
						{
							boardtx.fillStyle = colors[colorCodes[oldGrid[xpos][ypos]]];
						}
						else
						{
							boardtx.fillStyle = "#808080";
						}
				
						boardtx.fillRect(3+62*xpos + offset , 3 + 62*ypos , 60 , 60);
						boardtx.fillStyle = "#FFFFFF";
						boardtx.font = "20px Arial";
						if (oldGrid[xpos][ypos] < 100 )
						{
							boardtx.fillText(oldGrid[xpos][ypos], 26+62*xpos + offset , 37 + 62*ypos);
						}
						else if (oldGrid[xpos][ypos] <1000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 19+62*xpos + offset , 37 + 62*ypos);
						}
						else if (oldGrid[xpos][ypos] <10000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 12+62*xpos + offset , 37 + 62*ypos);
						}
						else
						{
							boardtx.fillText(oldGrid[xpos][ypos], 5+62*xpos + offset , 37 + 62*ypos);
						}*/
						break;
					case 2:
						drawcell (xpos ,  0 , ypos , -offset,0 ,3- offset );/*
						boardtx.fillStyle = "#FFFFFF";
						boardtx.fillRect(3+62*xpos , 3 + 62*ypos- offset +3 , 60 , 60);
						if ( colorCodes[oldGrid[xpos][ypos]])
						{
							boardtx.fillStyle = colors[colorCodes[oldGrid[xpos][ypos]]];
						}
						else
						{
							boardtx.fillStyle = "#808080";
						}
					
						boardtx.fillRect(3+62*xpos , 3 + 62*ypos - offset , 60 , 60);
						boardtx.fillStyle = "#FFFFFF";
						boardtx.font = "20px Arial";
						if (oldGrid[xpos][ypos] < 100 )
						{
							boardtx.fillText(oldGrid[xpos][ypos], 26+62*xpos , 37 + 62*ypos- offset );
						}
						else if (oldGrid[xpos][ypos] <1000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 19+62*xpos , 37 + 62*ypos- offset );
						}
						else if (oldGrid[xpos][ypos] <10000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 12+62*xpos , 37 + 62*ypos- offset );
						}
						else
						{
							boardtx.fillText(oldGrid[xpos][ypos], 5+62*xpos , 37 + 62*ypos- offset );
						}*/
						break;
					case 3:
						drawcell (xpos ,  0 , ypos , offset,0 ,-3- offset );/*
						boardtx.fillStyle = "#FFFFFF";
						boardtx.fillRect(3+62*xpos, 3 + 62*ypos + offset -3, 60 , 60);
						if ( colorCodes[oldGrid[xpos][ypos]])
						{
							boardtx.fillStyle = colors[colorCodes[oldGrid[xpos][ypos]]];
						}
						else
						{
							boardtx.fillStyle = "#808080";
						}
				
						boardtx.fillRect(3+62*xpos , 3 + 62*ypos+ offset , 60 , 60);
						boardtx.fillStyle = "#FFFFFF";
						boardtx.font = "20px Arial";
						if (oldGrid[xpos][ypos] < 100 )
						{
							boardtx.fillText(oldGrid[xpos][ypos], 26+62*xpos , 37 + 62*ypos+ offset);
						}
						else if (oldGrid[xpos][ypos] <1000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 19+62*xpos , 37 + 62*ypos+ offset);
						}
						else if (oldGrid[xpos][ypos] <10000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], 12+62*xpos , 37 + 62*ypos+ offset);
						}
						else
						{
							boardtx.fillText(oldGrid[xpos][ypos], 5+62*xpos  , 37 + 62*ypos+ offset);
						}*/
						break;
					}
					}
				}
			
			

				if (offset >30)
				{
					cancelAnimationFrame(drawit);
					var drawit2= requestAnimationFrame(simpleDraw);
					timer2 = 0;					
					offset2=0;
					if (scored.length >0)
					{
						var drawit3=requestAnimationFrame (function drawScore(){
						boardtx.fillStyle ="Black";
						var xpos =0 ;
						var ypos =0;
						var texttotype = "";
						boardtx.font = "20px Arial";
						timer2++						
						offset2 += 3*timer2;
						for (var scor = 0 ; scor < scored.length; scor ++)
						{
							xpos = scored[scor].x;
							ypos = scored[scor].y;
							texttotype = "+ " + scored[scor].sc;
							if (texttotype < 100 )
							{
								boardtx.fillText(texttotype, Math.floor(cellsize/2)-6+marginsize+(cellsize + marginsize)*xpos+offset2 , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos- offset2);
							}
							else if (texttotype <1000)
							{
								boardtx.fillText(texttotype, Math.floor(cellsize/2)-13+marginsize+(cellsize + marginsize)*xpos+offset2 , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos- offset2);
							}
							else if (texttotype <10000)
							{
								boardtx.fillText(texttotype, Math.floor(cellsize/2)-20+marginsize+(cellsize + marginsize)*xpos+offset2 , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos- offset2);
							}
							else	
							{
								boardtx.fillText(texttotype, Math.floor(cellsize/2)-27+marginsize+(cellsize + marginsize)*xpos+offset2  , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos- offset2);
							}
						}
						var drawit2= requestAnimationFrame(simpleDraw);
					
					
					
						if (offset2 > 30)
						{
							cancelAnimationFrame(drawit3);
							var drawit2= requestAnimationFrame(simpleDraw);
						}
						else
						{
							drawit3=requestAnimationFrame (drawScore);
						}
					
					
						});
					}
				}
				else
				{
					drawit = requestAnimationFrame(repeatOften);	
				}
			});
		}
		else
		{
			var drawit2= requestAnimationFrame(simpleDraw);
		}
	
	
	
	}

	function drawcell (xpos , xoffset , ypos , yoffset ,oldxoffset ,oldyoffset)
	{
		var board = document.getElementById("gameCanvas");
		var boardtx = board.getContext("2d");
		boardtx.fillStyle = "#FFFFFF";
		boardtx.fillRect(marginsize+(cellsize + marginsize)*xpos + oldxoffset, marginsize+(cellsize +marginsize)*ypos + oldyoffset, cellsize , cellsize); 
						if ( colorCodes[oldGrid[xpos][ypos]])
						{
							boardtx.fillStyle = colors[colorCodes[oldGrid[xpos][ypos]]];
						}
						else
						{
							boardtx.fillStyle = "#808080";
						}
					
						boardtx.fillRect(marginsize+(cellsize + marginsize)*xpos + xoffset,marginsize+(cellsize + marginsize)*ypos + yoffset, cellsize , cellsize);
						boardtx.fillStyle = "#FFFFFF";
						boardtx.font = "20px Arial";
						if (oldGrid[xpos][ypos] < 100 )
						{
							boardtx.fillText(oldGrid[xpos][ypos], Math.floor(cellsize/2)-6+marginsize+(cellsize + marginsize)*xpos + xoffset , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos + yoffset);
						}
						else if (oldGrid[xpos][ypos] <1000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], Math.floor(cellsize/2)-13+marginsize+(cellsize + marginsize)*xpos + xoffset , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos + yoffset);
						}
						else if (oldGrid[xpos][ypos] <10000)
						{
							boardtx.fillText(oldGrid[xpos][ypos], Math.floor(cellsize/2)-20+marginsize+(cellsize + marginsize)*xpos + xoffset , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos +  yoffset);
						}
						else
						{
							boardtx.fillText(oldGrid[xpos][ypos], Math.floor(cellsize/2)-27+marginsize+(cellsize + marginsize)*xpos + xoffset , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*ypos +  yoffset);
						}
	}

	function simpleDraw()
	{
		var board = document.getElementById("gameCanvas");
		var boardtx = board.getContext("2d");
		boardtx.clearRect(0,0,boardsize,boardsize);
		for (var i=0 ; i<4 ; i++)
		{
			for (var j=0; j<4; j++)
			{
				if(grid[i][j] != 0)
				{
					if ( colorCodes[grid[i][j]])
					{
						boardtx.fillStyle = colors[colorCodes[grid[i][j]]];
					}
					else
					{
						boardtx.fillStyle = "#808080";
					}
				
					boardtx.fillRect(marginsize+(cellsize + marginsize)*i, marginsize+(cellsize +marginsize)*j, cellsize , cellsize);
					boardtx.fillStyle = "#FFFFFF";
					boardtx.font = "20px Arial";
					if (grid[i][j] < 100 )
					{
						boardtx.fillText(grid[i][j], Math.floor(cellsize/2)-6+marginsize+(cellsize + marginsize)*i , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*j);
					}
					else if (grid[i][j] <1000)
					{
						boardtx.fillText(grid[i][j], Math.floor(cellsize/2)-13+marginsize+(cellsize + marginsize)*i , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*j);
					}
					else if (grid[i][j] <10000)
					{
						boardtx.fillText(grid[i][j], Math.floor(cellsize/2)-20+marginsize+(cellsize + marginsize)*i , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*j);
					}
					else
					{
						boardtx.fillText(grid[i][j], Math.floor(cellsize/2)-27+marginsize+(cellsize + marginsize)*i , Math.floor(cellsize/2)+5 + marginsize+(cellsize + marginsize)*j);
					}
				}
				else
				{
					boardtx.fillStyle = "#FFFFFF";
					boardtx.fillRect(marginsize+(cellsize + marginsize)*i, marginsize+(cellsize +marginsize)*j, cellsize , cellsize);
				}
			}
		}

	
	}


	function findEmpty()
	{
		var result = [];
		for (var i=0 ; i<4 ; i++)
		{
			for (var j=0 ; j<4 ; j++)
			{
				if (grid[i][j] == 0)
				{
					result[result.length]=[i,j];
				}
			}
		}
		return result;
	}

	function prepColor()
	{
		var temp= startingVal[0];
		colorCodes=[];
		switch (ruleOp)
		{
		case 0:
			for (var i=0; i<11; i++)
			{
				colorCodes[temp + (i * ruleValue)]= i+1;
			}
			break;
		case 1:
			for (var i=0; i<11; i++)
			{
				colorCodes[temp * Math.pow(ruleValue,i)]= i+1;
			}
			break;
		case 2:
			for (var i=0; i<11; i++)
			{
				colorCodes[temp - (i * ruleValue)]= i+1;
			}
			break;
		case 3:
			for (var i=0; i<11; i++)
			{
				colorCodes[temp  / Math.pow(ruleValue,i)]= i+1;
			}
			break;
		}
	}
gamestart();
jQuery(function($) {
			$("#dialog").dialog({
				modal: true,
				resizable: false,
				autoOpen: false,
				buttons: {
					"Play again": function() {
						gamestart();
						$(this).dialog("close");
											},
					"No thanks": function() {
						$(this).dialog("close");
					}
				}
			});
		});
jQuery(function($) {
			$("#dialog2").dialog({
				modal: true,
				resizable: false,
				autoOpen: false,
				buttons: {
					"Play again": function() {
						gamestart();
						$(this).dialog("close");
											},
					"Continue": function() {
						$(this).dialog("close");
					}
				}
			});
		});

});

jQuery.noConflict();
