// INITIALIZING VEHICULES
// ======================
// from JSON object..
// https://next.json-generator.com/N1tCE68bU

var crafts = [
	{
		"_id": "7eaa6cc6",
		"name": "Rover Opportunity",
		"isActive": false,
		"launchDate": 2011,
		"type": "probe",
		"direction": "North",
		"blackBox": ["Launch from Earth", "Landing on Mars"],
		"position": {
			"x": 0,
			"y": 0
		}
	},
	{
		"_id": "5c2ce7",
		"name": "Rover Dedication",
		"isActive": false,
		"launchDate": 2018,
		"type": "probe",
		"direction": "North",
		"blackBox": ["Launch from Earth", "Landing on Mars"],		
		"position": {
			"x": 0,
			"y": 0
		}
	},
	{
		"_id": "389eb7",
		"name": "Rover Emulation",
		"isActive": false,
		"launchDate": 2034,
		"type": "probe",
		"blackBox": ["Launch from Earth", "Landing the Moon"],		
		"position": {
			"x": 1,
			"y": 1
		}
	}
];

// use Json instead of object
//var rover = { direction : "North", position: { x: 0 , y: 0}, name: "Rover Opportunity", launchDate: "2001", destination: "Mars", travelLog: []};
//var rover2 = { direction : "North", position: { x: 9 , y: 9}, name: "Rover Dedication", launchDate: "2018", destination: "Mars", travelLog: [] };

// dirty assign before refactoring
var rover = crafts[0];
var rover2 = crafts[1];

// user is connected to no Rover by default
var currentRover = null;

// trigger event when a Rover is selected (to turn it green), red when offline.
var event = new Event('roverSelection'); 
var event2 = new Event('roverDisconnected'); 

// **************************//
// ********* MOVES ********* //
// **************************//

// ======================
// Rotating the vehicule to desired direction

function turnLeft(vehicule){
	console.log("turnLeft was called!");

	if (vehicule.direction === "North"){ vehicule.direction = "West"; }
	else if (vehicule.direction === "East"){ vehicule.direction = "North"; }
	else if (vehicule.direction === "South"){ vehicule.direction = "East"; }
	else { vehicule.direction = "South"; }
  
	console.log(vehicule.name + " is heading " + vehicule.direction + " after turning left on your input." );
}

function turnRight(vehicule){
	console.log("turnRight was called!");

	if (vehicule.direction === "North"){ vehicule.direction = "East"; }
	else if (vehicule.direction === "East"){ vehicule.direction = "South"; }
	else if (vehicule.direction === "South"){ vehicule.direction = "West"; }
	else { vehicule.direction = "North"; }

	console.log(vehicule.name + " headed  " + vehicule.direction + " on your input." );

}

// ======================
// Moving the vehicule according to current direction

function moveForward(vehicule){
	console.log("moveForward was called");

	if(vehicule.direction === "North"){ vehicule.position.x += 0; vehicule.position.y -= 1; } 
	else if(vehicule.direction === "East"){ vehicule.position.x += 1; vehicule.position.y += 0; } 
	else if (vehicule.direction === "South"){ vehicule.position.x += 0; vehicule.position.y += 1; } 
	else { vehicule.position.x -= 1; vehicule.position.y += 0; } 
	
	console.log(vehicule.name + " current position is [" +vehicule.position.x+ " " +vehicule.position.y + "] after moving forward on your input.");

}

function moveBackward(vehicule){
	console.log("moveBackward was called");

	if(vehicule.direction === "North"){ vehicule.position.x += 0; vehicule.position.y += 1; } 
	else if(vehicule.direction === "East"){ vehicule.position.x -= 1; vehicule.position.y += 0; } 
	else if (vehicule.direction === "South"){ vehicule.position.x += 0; vehicule.position.y -= 1; } 
	else { vehicule.position.x += 1; vehicule.position.y += 0; } 
	
	console.log(vehicule.name + " current position is [" +vehicule.position.x+ " " +vehicule.position.y + "] after moving backward on your input.");
}

// ======================
// Focus commands on User chosen rover
// TODO adapt for each json crafts[i]..
function focusRover(vehicule) {
	if (vehicule == 0) {
		console.log("User disconnected");
		document.dispatchEvent(event2);
		currentRover = null;

	} else if (vehicule == 1){
		console.log("User is connected to " + rover.name + ".");
		currentRover = rover;
		document.dispatchEvent(event);

	} else if(vehicule == 2) {
		console.log("User is connected to " + rover2.name + ".");
		currentRover = rover2;
		document.dispatchEvent(event);

	} else {
		console.log("Pending for connexion to chosen Rover...");
		currentRover = null;
	} 
	return currentRover;	
} 

// ======================
// Processing User commands 	

// from text input (lrfb)
function readCmd(input, vehicule, operator) {
	console.log("initiating sequence: " + input);
	for (var i = 0; i < input.length; i++) {

		let value = input.charAt(i); 
		// push operator, operation and timestamp to log arr..
		console.log(operator);
		if (value === "l"){
			turnLeft(vehicule);

		} else if (value === "r"){
			turnRight(vehicule);

		} else if (value === "f"){
			moveForward(vehicule);

		} else if (value === "b"){
			moveBackward(vehicule);
		} else {
			console.log( value + " is not a valid input, please use (f)orward, (b)ackward, (r)ight or (l)eft.");
		}

		// print current position when vehicule has executed it's last move 
		if (i === input.length - 1) {
			console.log(vehicule.name + " is currently located to [" + vehicule.position.x + ", " + vehicule.position.y + "] heading " + vehicule.direction);
		}	
	}
}

// from keyboad to chosen rover
// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function(e) {
	e = e || window.event;
	if (currentRover != null) {
		switch(e.which || e.keyCode) {
		case 37: // left
			turnLeft(currentRover);
			break;

		case 38: // up
			moveForward(currentRover);
			break;

		case 39: // right
			turnRight(currentRover);
			break;

		case 40: // down
			moveBackward(currentRover);
			break;

		default: return; // exit this handler for other keys
		} 
	}else {
		alert("No rover was selected !\nConnecting on Rover Opportunity by default..");
		document.dispatchEvent(event);
		currentRover = rover;
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
};

// **************************//
// **** EXERCISE RESULT **** //
// **************************//

// Start emitting scenario on User click:
// prompt for Rover choice and command sequence, default is rffrfflfrff

// TODO adapt for each json crafts[i]..
function initScenarii () {
	var probe = prompt("Please choose a probing vehicule: \n- 1 for Opportunity Rover\n - 2 for Dedication Rover", "1");
	var operator = prompt("Please enter your name");
	var cmd = prompt("Please enter Rover's sequence... \n Available commands are :\n - (f)orward\n - (b)ackward\n- (l)eft\n- (r)ight", "zrffrfflfrff");

	if (cmd != null && probe == 1) {
		readCmd(cmd, focusRover(1), operator);
	} else if (cmd != null && probe == 2){
		readCmd(cmd, focusRover(2), operator);
	} else {
		location.reload();
	}	
}

// **************************//
// *********** GUI ********* //
// **************************//
// Using D3.js library
// Adapted from https://bl.ocks.org/danasilver/cc5f33a5ba9f90be77d96897768802ca

//create GUI only after page load..
window.onload = function (){

	var width = 250,
		height = 250,
		resolution = 25,
		r = 25;

	// TODO adapt for each json crafts[i].. x, y and name
	var points = d3.range(2).map(function() {
		return {
			x: round(Math.random() * width, resolution), 
			y: round(Math.random() * height, resolution)
		};
	});

	// seed obstacles
	var obstacles = d3.range(3).map(function() {
		return {
			x: round(Math.random() * width, resolution), 
			y: round(Math.random() * height, resolution)
		};
	});

	// add draggable behaviour 
	var drag = d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("drag", dragged);

	// create a canvas 
	var svg = d3.select("#grid").append("svg")
		.attr("width", width)
		.attr("height", height);

	// draw vertical line TODO add thicker line each 2
	svg.selectAll(".vertical")
		.data(d3.range(1, width / resolution))
		.enter().append("line")
		.attr("class", "vertical")
		.attr("x1", function(d) { return d * resolution; })
		.attr("y1", 0)
		.attr("x2", function(d) { return d * resolution; })
		.attr("y2", height);
	
	// draw vertical line TODO add thicker line each 2
	svg.selectAll(".horizontal")
		.data(d3.range(1, height / resolution))
		.enter().append("line")
		.attr("class", "horizontal")
		.attr("x1", 0)
		.attr("y1", function(d) { return d * resolution; })
		.attr("x2", width)
		.attr("y2", function(d) { return d * resolution; });
	
	// draw circle from upper data TODO for each rover..
	var circles = svg.selectAll("circle")
		.data(points)
		.enter().append("circle")
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", r / 2)
		.attr("transform", function(d) { return "translate(" + 12.5 + "," + 12.5 + ")"; }) // bypass grid offset
		.classed("rover", true);
		//.call(drag) // make it draggable 
		// TODO ADD ORIENTATION CLUE NSWE... 
	
	// math max is enforcing bounds of draggable rovers TODO apply to user input
	function dragged(d) {
		var x = d3.event.x,
			y = d3.event.y,
			gridX = round(Math.max(r, Math.min(width - r, x)), resolution),
			gridY = round(Math.max(r, Math.min(height - r, y)), resolution);

		d3.select(this).attr("cx", d.x = gridX).attr("cy", d.y = gridY);
	}
	
	// rounding values
	function round(p, n) {
		return p % n < n / 2 ? p - (p % n) : p + n - (p % n);
	}

	// DIRTY update of rover position on GUI
	// see http://www.tutorialsteacher.com/d3js/event-handling-in-d3js
	// for each vehicule, update position (currently only one rover is supported)
	var circle = d3.select("circle");
	setInterval(() => {
		circle.transition()
			.duration(250)
			.attr("cx", rover.position.x * 25)
			.attr("cy", rover.position.y * 25)
			.ease(d3.easeElastic);	
	}, 250);
		
	// change circle color according to rover's status
	document.addEventListener("roverSelection", function () { 
		var circle = d3.select("circle")
			.classed("online-rover", true);
	}, false);
	
	// disconnect rover	and turn it red on event
	document.addEventListener("roverDisconnected", function () { 
		var circle = d3.select("circle")
			.classed("online-rover", false);
		focusRover(0);
	}, false);

	// add text to identify rovers
	// TODO dynamic text position 
	// https://www.dashingd3js.com/svg-text-element
	// http://bl.ocks.org/ChrisJamesC/4474971
	var text = svg.selectAll("text")
		.data(points)
		.enter()
		.append("text");

	var textLabels = text
		//.data(circles)
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.text( function (d) { return d.x / 10 + ", " + d.y / 10; })
		.attr("font-family", "Arial")
		.attr("font-size", "16px")
		.attr("fill", "black")
		.attr("transform", function(d) { return "translate(" + 12.5 + "," + 12.5 + ")"; });


	// TODO add collision alert
	var worries = svg.selectAll("obs")
		.data(obstacles)
		.enter().append("path")
		.attr("d", d3.svg.symbol().type("triangle-up").size(200))
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.style("fill", "grey");

}; // end of window load

// COLLISION ALERT
// ENFORCING BOUNDARIES
// TODO ADD A ZOOM OPTION https://bl.ocks.org/mbostock/6123708
// TODO REACT https://stackblitz.com/edit/react-rover
// TODO PERSISTANCE with PG

// **************************//
// ***** TESTING STUFF ***** //
// **************************//

// BASIC ROTATION TESTING

//turnRight(rover);
//turnRight(rover);
//turnLeft(rover);
//turnLeft(rover);


// BASIC THRUST TESTING
//moveForward(rover);
//moveForward(rover);
//moveBackward(rover);

// EXERCISE
// input rffrfflfrff, expected rover position would be [3,4] heading south
// readCmd("rffrfflfrff", rover);