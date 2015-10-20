

var cardlist = [];
var xlen = 5;
var ylen = 4; 
var equationText = "";
var equation = []; // first is the operation, then the position of the known, then the value of the known 
var currentplayer = 0;
var score= [0,0];
var peeked = 0;
var cardpeeked =[];
var cardpeekedname=[];
var cardpeekedid=[];
var game = 0;
var playAI = 1;
var difficulty = 2;
var aiMemory =[];
var toErase1="";
var toErase2="";
 

function getdifficulty()
{
	
}

function findxlen()
{
	
}
function findylen()
{
	
}

function startgame()
{
	game =1;
	peeked = 0;
	var cardvalue = 0;
	currentplayer = 0;
	score = [0,0];
	document.getElementById("player1").innerHTML="";
	document.getElementById("player2").innerHTML="";
	for (var j=0; j<ylen; j++)
	{
		for (var i=0; i< xlen ; i++)
		{
			cardvalue = Math.floor(Math.random()*(i+j))+i+j;
			var position = cardlist.length;
			cardlist[position]={"hidden":0,"val":cardvalue,"x":i,"y":j,"position":position };
		}
		
	}
	fisherYates (cardlist);
	for (var j=0; j<ylen; j++)
	{
		for (var i=0; i< xlen ; i++)
		{
			cardlist[j*xlen + i].x=i;
			cardlist[j*xlen + i].y=j;
			document.getElementById("cardx"+i+"y"+j).innerHTML='<div class="flipper"> <div class="front"> <img src="mathlogo.jpg"> </div> <div class="back"> <p>'+cardlist[j*xlen + i].val+'</p> </div> </div>';
			
			
		}
		
	}
	equationText=findEquation();
	document.getElementById("rules").innerHTML=equationText;
	document.getElementById("turn").innerHTML="Your turn: Click to flip 2 cards and try to complete the equation.";
}

function fisherYates ( myArray ) 
{
	var i = myArray.length;
	if ( i == 0 ) return false;
	while ( --i ) 
	{
		var j = Math.floor( Math.random() * ( i + 1 ) );
     		var tempi = myArray[i];
     		var tempj = myArray[j];
     		myArray[i] = tempj;
     		myArray[j] = tempi;
   	}
	return myArray;
}

function toggle(cardname)
{
	//console.log(cardname + " value: " + cardlist[cardpeekedid[peeked]].val + " position: " + cardpeekedid[peeked]);
	var cardid="#"+cardname;
	document.getElementById(cardname).classList.toggle("flip");
}

function clickOnCard(cardname)
{
	if (toErase1 != "")
	{
			document.getElementById(toErase1).innerHTML="";
			document.getElementById(toErase2).innerHTML="";
			toErase1="";
			toErase2="";
	}	
	if (peeked == 1)
	{
		if (cardname == cardpeekedname[0])
		{
			return;
		}
	}
	//console.log(game);
	if (game != 1)
	{
		//if (confirm("Do you want to start a game?"))
		//{
			toastr["info"]("Start a new game VS AI", "New Game")
			startgame();
		
		//}
		return;
	}
	if (peeked == 2)
	{
		toggle(cardpeekedname[0]);
		toggle(cardpeekedname[1]);
		peeked =0;
		currentplayer = 1 - currentplayer;
		temp = currentplayer *1 +1;
		if (temp == 1) 
		{
			var tempname = "Your";			
		}	
		else
		{
			var tempname = "AI"
		}
		document.getElementById("turn").innerHTML=tempname+" turn: Click on 2 cards to try to complete the equation.";
		return;
		
		
	}
	if (playAI == 0 || currentplayer * 1 == 0)
	{

		var xval =4;
		var yval =0;
		for (var i=6; i< cardname.length; i++)
		{
			if (cardname.charAt(i)=="y")
			{
				yval =i;
				break;
			}
		}
		var xpos = parseInt(cardname.substring(5,yval));
		var ypos = parseInt(cardname.substring(yval+1));
		var inexistant = true;
		for (var i=0; i<cardlist.length ; i++)
		{
			if ((cardlist[i].x == xpos)&&(cardlist[i].y==ypos))
			{
				cardpeeked[peeked]=cardlist[i].val;
				cardpeekedid[peeked]=i;
				aiMemory.push(cardlist[i]);
				inexistant = false;
				break;
			}
		}
		if (inexistant)
		{
			document.getElementById(cardname).innerHTML="";
			return;
		}
		toggle(cardname);
		cardpeekedname[peeked]=cardname;
		peeked++;
	}
	else
	{
		aiplay();
	}

	if (peeked == 2)
	{
		temp = currentplayer *1 +1;
		if (playAI == 0 || temp == 1)
		{
			document.getElementById("turn").innerHTML="Your turn: Click on any card after memorizing the cards you flipped.";
		}
		else
		{
			document.getElementById("turn").innerHTML="AI'turn : Click on any card after memorizing the flipped cards.";
		}
		var eq = testEquation(cardpeeked[0],cardpeeked[1]);
		if (eq.length == 0)
		{
			return;
		}
		else
		{
			var temp = currentplayer+1;
			score[currentplayer] ++;
			document.getElementById("Scores").innerHTML = "Current scores :<br> You :"+score[0]+" <br> AI : "+score[1];
			document.getElementById("player"+temp).innerHTML += eq + "<br>";
			cleanAIMem(cardlist[cardpeekedid[0]].position,cardlist[cardpeekedid[1]].position);
			if (cardpeekedid[0]>cardpeekedid[1])
			{
				cardlist.splice(cardpeekedid[0],1);
				cardlist.splice(cardpeekedid[1],1);			
			}
			else
			{
				cardlist.splice(cardpeekedid[1],1);
				cardlist.splice(cardpeekedid[0],1);					
			}
			if (cardlist.length >0)
			{
				if (temp == 1) 
				{
					var tempname = "Your turn: Click on 2 cards to try to complete this new equation.";			
				}	
				else
				{
					var tempname = "AI's turn: click on any card to see the AI's choices."
				}
				document.getElementById("turn").innerHTML=tempname;
				peeked =0;
				var eq2 = findEquation();
				document.getElementById("rules").innerHTML = eq2;
			}
			else
			{
				var winner = "You win";
				var finalscore = score[0] + " to " + score [1];
				if (score[1]>score[0])
				{
					winner = "AI wins";
					finalscore = score[1] + " to " + score [0];
				}
				/*if (confirm("Game Over. \n " + winner + " by " +finalscore +".\n Try again?"))
				{
					document.location.reload();
				}
				else
				{
					location.reload();
	
				}*/
				$("#dialog").html(winner + " by " +finalscore +".\n Try again?");
				$("#dialog").dialog("open");
			}
			toastr["success"](eq, "Equation Solved");
			toErase1=cardpeekedname[0];
			toErase2=cardpeekedname[1];
			setTimeout(doSomething, 1500);

function doSomething() {
			document.getElementById(toErase1).innerHTML="";
			document.getElementById(toErase2).innerHTML="";
			toErase1="";
			toErase2="";
}
			
			//cleanAIMem(cardlist[cardpeekedid[0]].position,cardlist[cardpeekedid[1]].position);

			

		}
	}

	if (peeked == 1)
	{
		var temp = currentplayer + 1;
		if (temp == 1) 
		{
			var tempname = "Your";			
		}	
		else
		{
			var tempname = "AI"
		}
		document.getElementById("turn").innerHTML=tempname +" turn: Click on a second card to try to complete the equation.";
		return;
	}
	
}
function findcurrentposition ( position)
{
	for (var i= 0 ; i< cardlist.length ; i++)
	{
		if (cardlist[i].position == position )
		{
			return i;
		}
	}
}

function findEquation()
{
	var message = "The current equation is: ";
	var messop="";
	var knownpos = Math.floor(Math.random()*3);
	var knownvalue=0;
	var op =Math.floor(Math.random()*4); // 0 add , 1 sub. 2 mult, 3 div
	switch (op)
	{
	case 0:
		if (knownpos == 2)
		{
			knownvalue = findAddition();
		}
		else
		{
			knownvalue = findsubtraction();
		}
		messop="+";
		break;
	case 1:
		if (knownpos == 0)
		{
			knownvalue = findAddition();
		}
		else
		{
			knownvalue = findsubtraction();
		}
		messop="-";
		break;
	case 2:
		if (knownpos == 2)
		{
			knownvalue = findMult();
		}
		else
		{
			knownvalue = findDiv();
			if (knownvalue == -1)
			{
				knownpos = 2;
				knownvalue = findMult();
			}			
		}
		messop="x";
		break;	
	case 3:
		if (knownpos == 0)
		{
			knownvalue = findMult();
		}
		else
		{
			knownvalue = findDiv();
			if (knownvalue == -1)
			{
				knownpos = 0;
				knownvalue = findMult();
			}
		}
		messop="/";
		break;
	}
	equation =[op,knownpos,knownvalue];
	if (equation[1] == 0)
	{
		message += equation[2]+ " ";
	}
	else
	{
		message += " ?? ";
	}
	message += messop + " ";
	if (equation[1] == 1)
	{
		message += equation[2]+ " ";
	}
	else
	{
		message += " ?? ";
	}	
	message += " = ";
	if (equation[1] == 2)
	{
		message += equation[2]+ " ";
	}
	else
	{
		message += " ?? ";
	}	
	return message;
	
}

function findAddition()
{
	var combo = [];
	for (var i=0; i<cardlist.length; i++)
	{
		for (var j=i+1; j< cardlist.length; j++)
		{
			combo[combo.length]=cardlist[i].val+cardlist[j].val;
		}
	}
	return combo[Math.floor(Math.random()*combo.length)];
}

function findsubtraction()
{
	var combo = [];
	for (var i=0; i<cardlist.length; i++)
	{
		for (var j=i+1; j< cardlist.length; j++)
		{
			combo[combo.length]=Math.abs(cardlist[i].val-cardlist[j].val);
		}
	}
	return combo[Math.floor(Math.random()*combo.length)];
}

function findMult()
{
	var combo = [];
	for (var i=0; i<cardlist.length; i++)
	{
		for (var j=i+1; j< cardlist.length; j++)
		{
			combo[combo.length]=cardlist[i].val*cardlist[j].val;
		}
	}
	return combo[Math.floor(Math.random()*combo.length)];
}

function findDiv()
{
	var combo = [];
	var test = 0;
	for (var i=0; i<cardlist.length; i++)
	{
		for (var j=i+1; j< cardlist.length; j++)
		{
			test= cardlist[j].val/cardlist[i].val;
			if (isInt(test))
			{
				combo[combo.length]=test;
			}
			test = cardlist[i].val/cardlist[j].val;
						if (isInt(test))
			{
				combo[combo.length]=test;
			}
		}
	}
	if (combo.length == 0)
	{
		return -1;
	}
	else 
	{
		return combo[Math.floor(Math.random()*combo.length)];
	}
}

function isInt(n) {
   return n % 1 === 0;
}

function testEquation(val1 , val2)
{
	var knownpos = equation[1];
	switch (equation[0])
	{
	case 0:
		if (knownpos == 2)
		{
			if((val1 + val2) == equation[2])
			{
				return val1 + " + "+val2+ " = "+equation[2]; 
			}
			else
			{
				return "";
			}
		}
		else
		{
			if ((val1 - val2 ) == equation[2])
			{
				if (knownpos == 0)
				{
					return equation[2] + " + " +  val2 + " = " + val1;
				}
				else
				{
					return  val2 + " + " + equation[2]+ " = " + val1;
				}
			}
			else if((val2 - val1 ) == equation[2])
			{
				if (knownpos == 0)
				{
					return equation[2] + " + " +  val1 + " = " + val2;
				}
				else
				{
					return  val1 + " + " + equation[2]+ " = " + val2;
				}			
			}
			else
			{
				return "";
			}
		}
		break;
	case 1:
		if (knownpos == 0)
		{
			if((val1 + val2) == equation[2])
			{
				return equation[2] + " - " + val1+ " = "+val2; 
			}
			else
			{
				return "";
			}
		}
		else
		{
			if ((val1 - val2 ) == equation[2])
			{
				if (knownpos == 1)
				{
					return  val1 + " - " +  equation[2] + " = " + val2;
				}
				else
				{
					return  val1 + " - " + val2 + " = " + equation[2];
				}
			}
			else if((val2 - val1 ) == equation[2])
			{
				if (knownpos == 1)
				{
					return  val2 + " - " +  equation[2] + " = " + val1;
				}
				else
				{
					return  val2 + " - " + val1 + " = " + equation[2];
				}			
			}
			else
			{
				return "";
			}
		}
		break;
	case 2:
		if (knownpos == 2)
		{
			if((val1 * val2) == equation[2])
			{
				return val1 + " x " + val2+ " = "+equation[2]; 
			}
			else
			{
				return "";
			}
		}
		else
		{
			if ((val1 / val2 ) == equation[2])
			{
				if (knownpos == 0)
				{
					return equation[2] + " x " +  val2 + " = " + val1;
				}
				else
				{
					return  val2 + " x " + equation[2]+ " = " + val1;
				}
			}
			else if((val2 / val1 ) == equation[2])
			{
				if (knownpos == 0)
				{
					return equation[2] + " x " +  val1 + " = " + val2;
				}
				else
				{
					return  val1 + " x " + equation[2]+ " = " + val2;
				}			
			}
			else
			{
				return "";
			}
		}
		break;	
	case 3:
		if (knownpos == 0)
		{
			if((val1 * val2) == equation[2])
			{
				if (val2 != 0)
				{
					return equation[2] + " / " + val2+ " = "+val1; 
				}
				else
				{
					return equation[2] + " / " + val1+ " = "+val2; 

				}
			}
			else
			{
				return "";
			}
		}
		else
		{
			if ((val1 / val2 ) == equation[2])
			{
				if (knownpos == 1)
				{
					return val1 + " / " + equation[2] + " = " + val2;
				}
				else
				{
					return  val1 + " / " + val2 + " = " + equation[2];
				}
			}
			else if((val2 / val1 ) == equation[2])
			{
				if (knownpos == 1)
				{
					return val2 + " / " +  equation[2] + " = " + val1;
				}
				else
				{
					return  val2 + " / " + val1 + " = " + equation[2];
				}			
			}
			else
			{
				return "";
			}
		}
		break;
	}
}

function aiplay()
{
	var knowPlay = [];
	var i = 0;
	var j=1;
	
	if (aiMemory.length > 1)
	{
		while (i<aiMemory.length -1 && knowPlay.length == 0)
		{ 
			while (j< aiMemory.length && knowPlay.length == 0)
			{
				if (aiMemory[i].position==aiMemory[j].position)
				{
					j++;
				}
				else
				{
					if(testEquation(aiMemory[i].val , aiMemory[j].val).length >0 )
					{
						knowPlay = [aiMemory[i] , aiMemory[j]];
					}
					else
					{
						j++;
					}
				}
			}
			i++;
			j=i+1;
		}
	}

	if (knowPlay.length == 2)
	{
		cardpeekedname[0] = "cardx" + knowPlay[0].x+"y"+knowPlay[0].y ;		
		cardpeekedname[1] =  "cardx" + knowPlay[1].x+"y"+knowPlay[1].y;
		cardpeeked[0] = knowPlay[0].val;
		cardpeeked[1] = knowPlay[1].val;
		cardpeekedid[0] = findcurrentposition(knowPlay[0].position);
		cardpeekedid[1] = findcurrentposition(knowPlay[1].position);
		toggle(cardpeekedname[0]);
		toggle(cardpeekedname[1]);
	}
	else
	{
		var rand1 = Math.floor(Math.random() * cardlist.length);
		var rand2 = rand1;
		if (difficulty >= 3 && aiMemory.length >0)
		{
			var idx=0;
			while (rand2 == rand1 && idx < aiMemory.length)
			{
				if (testEquation(cardlist[rand1].val,aiMemory[idx].val).length > 0)
				{
					if (findcurrentposition(aiMemory[idx].position) == rand1)
					{
						break; // if the first card picked was in memory there is no other card inmemory that mathces
					}
					else
					{
						rand2 = findcurrentposition(aiMemory[idx].position);
					}
				}
				idx ++;	
			}
			
		}
		
		while(rand2 == rand1)
		{
			rand2 = Math.floor(Math.random() * cardlist.length);
		}
		console.log(rand1 + " // " + rand2);
		cardpeekedname[0] = "cardx" + cardlist[rand1].x+"y"+cardlist[rand1].y ;		
		cardpeekedname[1] =  "cardx" + cardlist[rand2].x+"y"+cardlist[rand2].y;
		cardpeeked[0] = cardlist[rand1].val;
		cardpeeked[1] = cardlist[rand2].val;
		cardpeekedid[0] = rand1;
		cardpeekedid[1] = rand2;
		aiMemory.push(cardlist[rand1]);
		aiMemory.push(cardlist[rand2]);
		toggle(cardpeekedname[0]);
		toggle(cardpeekedname[1]);
	}
	if (testEquation(cardpeeked[0] , cardpeeked[1]).length >0)
	{
		cleanAIMem(cardlist[cardpeekedid[0]].position,cardlist[cardpeekedid[1]].position);
	}
	while (aiMemory.length > difficulty *2)
	{		
		aiMemory.shift();
	}
	peeked = 2;
	var logtext = "";
	for (var i = 0 ; i<aiMemory.length ; i++)
	{
		logtext += ", value: " + aiMemory[i].val + " position: "+ aiMemory[i].position; 
	}
	console.log(logtext);
}

function cleanAIMem(pos1,pos2)
{
	var idx = 0;
	while ( idx < aiMemory.length )
	{		
		if (aiMemory[idx].position == pos1 || aiMemory[idx].position == pos2)
		{
			aiMemory.splice(idx , 1);
		}
		else
		{
			idx++;
		}
	}
}

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

jQuery(function($) {
			$("#dialog").dialog({
				modal: true,
				resizable: false,
				autoOpen: false,
				buttons: {
					"Play again": function() {
						document.location.reload();
						
											},
					"No thanks": function() {
						//window.location.href= "file:///C:/wamp/www/games.html";
							$("#dialog").dialog('close');
					}
				}
			});
		});


