$(document).ready(function() {
  
var cards=[];
var count = 0;

function init()
{
	setCard(0);
	$( "#gameAreaTop, #gameAreaBottom"  ).sortable({
			cancel : ".aStar, #deck, #ruler",
			connectWith: ".connectedSortable",
			over: function () {
				resize();
			},
			stop: function (event , ui) {
				resize();
				var moved = ui.item;
				var comp = moved.find(".starComp");
				if ( moved.parent().hasClass("bottom") )
				{
					comp.removeClass("hidden");
					$("#ruler").removeClass("hidden");
					$(".finger").addClass("hidden");
					if ( !$("#ruler").hasClass("blink"))
					{
						$("#ruler").addClass("blink");
					}

				}
				else
				{
					if (!comp.hasClass("hidden"))
					{
								moved.find(".starComp").addClass("hidden");
					}
					if ( !$("#ruler").hasClass("hidden"))
					{
						$("#ruler").addClass("hidden");
					}
				}
					
		}
	}).disableSelection();

	cards = fisherYates([2,3,4,5,6,7,8,9,10]);
	/*console.log(cards);
	console.log(cards.pop());
	console.log(cards);*/
	count = 10;
	$("#count").text(count);
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

function setCard(id)
{
	//console.log("setting card");
	
	var $Card = $('.myCard').clone(true);
	//var $child = $('.myCard>*').clone();
	//$Card.append($child);
	$Card.find('.starName').text( stars[id].name );
	$Card.find('.starImg').attr("src","images/" + stars[id].image );
	$Card.attr('id',id);
	$Card.addClass("current");
	$Card.addClass("draggable");
	
	//console.log(myCard);
	$("#gameAreaTop").append($Card);
	resize();
	$(document.body).append($(".finger"));
}

function resize()
{
	var div= $(".current");
	var width = 0.2 * $('#gameAreaTop').width();
	var height = $('#gameAreaTop').height();
	if (div.parent().hasClass("bottom"))
	{
		var width = 0.08 * $('#gameAreaBottom').width();
		div.css('width',width);
		//div.css('height',"100%");
		return;

	}
	
	//console.log(width + "h " + height);

	if (width > height)
	{
		//div.css('height',height);
		div.css('width',height);
	}
	else
	{
		//div.css('height',width);
		div.css('width',width);
	}
}

init();

$("#ruler").click(function () {

	var tested = $(".current");
	var id = parseInt(tested.attr("id"));
	comparison();
	$("#ruler").addClass("hidden");
	
});

function comparisonEnd(success) // invoked after the closing of the comparison pop up.
{
	var tested = $(".current");
	var id = parseInt(tested.attr("id"));
	if (success)
	{
		tested.removeClass("current");
		tested.addClass("aStar");
		tested.removeClass("myCard");
		tested.find(".starComp").attr("src","images/" + stars[id].comp );
		count --;
		$("#count").text(count);
		if ( count == 0)
		{
			gameOver();
			return;
		}
		
		setCard(cards.pop());
		
	}
	else
	{
		
		cards.push(id);
		cards = fisherYates( cards); // put back the star in teh deck
		console.log(cards);

		destroy ( tested);
		
	}
}

function gameOver()
{
	var ww = $(window).width()*0.9; 
	var hh = $(window).height()*0.9;
	$("#winScreen").dialog({
		title:"Congratualtions!",
		resizable : false,
		height : hh,
		width : ww,
		modal: true,
		buttons : {
			"Play again": function(){
				location.reload();
				$( this).dialog("close");
			},
			"Close": function () {
				$( this).dialog("close");
			}

		}
	});
}

// Here we remove the worngly guessed star and play an animation to show it getting back in the deck
function destroy()
{	
	var testPosition = $(".current").offset();
	var deckPosition = $("#deck").offset();
	var cardBack= $(".backOfCard").clone();
	cardBack.appendTo($(document.body));
	cardBack.css("position","absolute");
	cardBack.offset(testPosition);
	cardBack.animate({
		top: deckPosition.top,
		left:deckPosition.left
	}, 1500, "swing", function() {
		cardBack.remove();
		$(".current").remove();
		setCard(cards.pop());
	})	
      

	
}

function comparison()
{
	var $comp = $(".comparisonDialog").clone();
	var tested = $(".current");
	var testedId = parseInt(tested.attr("id"));
	var tSize = stars[testedId].size;


	var previous = tested.prev(); // find the star to the left.
	var previousId = -1;
	var pSize = 0;

	if (previous.hasClass("aStar")) // check if there is a previous element
	{
		previousId =  parseInt(previous.attr("id") );
		$comp.find(".previous >.starName").text( stars[previousId].name);
		$comp.find(".previous > .starImg").attr("src","images/"+ stars[previousId].image);
		pSize = stars[previousId].size;
		
	}

	var next = tested.next(); // find the star to the right
	var nextId = -1;
	var nSize=0;
	if (next.hasClass("aStar")) // check if there is a next element
	{
		nextId = parseInt(next.attr("id")) ;
		$comp.find(".next >.starName").text( stars[nextId].name);
		$comp.find(".next > .starImg").attr("src","images/"+ stars[nextId].image);
		nSize = stars[nextId].size;
	}

	$comp.find(".tested >.starName").text( stars[testedId].name);
	$comp.find(".tested > .starImg").attr("src","images/"+ stars[testedId].image);

	// the comparison pop up element are now ready. only need to set the size taking into account the number of stars in the comparison

	var ww = $(window).width()*0.9; 
	var hh = $(window).height()*0.9;
	var factor = 1;  // a factor to take into account the fac that the comaprison is between 2 or 3 stars
	if (previousId == -1)
	{
		$comp.find(".tested").css("width","50%");
		$comp.find(".next").css("width","50%");
		factor=0.4;
	}
	else if (nextId == -1)
	{
		$comp.find(".tested").css("width","50%");
		$comp.find(".previous").css("width","50%");
		factor=0.4;
	}
	else
	{
		$comp.find(".tested").css("width","33%");
		$comp.find(".next").css("width","33%");
		$comp.find(".previous").css("width","33%");
		factor=0.25;
	}

	$comp.find(".starImg").css("width","33%"); // for the animatio each star starts at 33% of it's area.
	
	if ( pSize <= tSize && (tSize <= nSize || nSize == 0) )  // this adds a check or X as feedback
	{
		var right = $(".right").clone();
		right.css("opacity",0.0);
		$comp.append(right);
	}
	else
	{
		var wrong = $(".wrong").clone();
		wrong.css("opacity",0.0);
		$comp.append(wrong);
	}	


	$comp.dialog({
		title: "Star Comparison",
		resizable : false,
		height : hh,
		width : ww,
		modal: true,
		buttons : {
			"compare" : function () {   // this animate the satr size ... for quick coding it's animated based on width.  a more robust animation would compare width and height.
				$comp.find(".starName").remove();
				$comp.find(".previous").find(".starImg").animate({ width: ww*factor*pSize / (pSize + tSize + nSize)},800);
				$comp.find(".next").find(".starImg").animate({
					width: ww*factor*nSize / (pSize + tSize + nSize)
				},800);
				$comp.find(".tested").find(".starImg").animate({
					width: ww*factor*tSize / (pSize + tSize + nSize)},
					800);
				$comp.find(".right").animate({opacity:1 },{queue:true});
				$comp.find(".wrong").animate({ opacity:1 },{queue:true});



			},
			"Close" : function() {
				$( this ).dialog( "close" );
				$comp.remove();
			}
		},
		 close: function( event, ui ) {
		 	if ( pSize <= tSize && (tSize <= nSize || nSize == 0) ) // the meat of the engine telling us if the satr was correctly placed.
			{
				comparisonEnd(true);
			}
			else
			{
				comparisonEnd(false);
			}
		 }
	});





}


});