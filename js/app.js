// INITIALIZING VEHICULES
// ======================
// json data https://next.json-generator.com/N1tCE68bU

var crafts = [{
	"sn": "7eaa6cc6",
	"_id": 0,
	"name": "Rover Opportunity",
	"isActive": true,
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
	"sn": "5c2ce7",
	"_id": 1,
	"name": "Rover Dedication",
	"isActive": true,
	"launchDate": 2018,
	"type": "probe",
	"direction": "North",
	"blackBox": ["Launch from Earth", "Landing on Mars"],
	"position": {
		"x": 1,
		"y": 1
	}
},
];

// declaring libs and app vars
var currentVehicule;
var d3;
var hulla;

// events about Rover uplink with user, green for online, red for offline.
var event = new Event('roverOn');
var event2 = new Event('roverOff');

// **************************//
// ********* MOVES ********* //
// **************************//

// ======================
// Rotating the vehicule to desired direction

function turnLeft(vehicule) {

	if (vehicule.direction === "North") {
		vehicule.direction = "West";
	} else if (vehicule.direction === "East") {
		vehicule.direction = "North";
	} else if (vehicule.direction === "South") {
		vehicule.direction = "East";
	} else {
		vehicule.direction = "South";
	}

	console.log(vehicule.name + " heading  " + vehicule.direction + " after turnLeft was called!");
}

function turnRight(vehicule) {

	if (vehicule.direction === "North") {
		vehicule.direction = "East";
	} else if (vehicule.direction === "East") {
		vehicule.direction = "South";
	} else if (vehicule.direction === "South") {
		vehicule.direction = "West";
	} else {
		vehicule.direction = "North";
	}

	console.log(vehicule.name + " heading  " + vehicule.direction + " after turnRight was called!");
}

// ======================
// Moving the vehicule according to current direction

function moveForward(vehicule) {

	if (vehicule.direction === "North") {
		vehicule.position.y--;
	} else if (vehicule.direction === "East") {
		vehicule.position.x++;
	} else if (vehicule.direction === "South") {
		vehicule.position.y++;
	} else {
		vehicule.position.x--;
	}

	// TO DRY
	let msg = vehicule.name + " current position is [" + vehicule.position.x + " " + vehicule.position.y + "] after moving forward on your input.";
	console.log(msg);

	moveCircle(vehicule.position.x, vehicule.position.y);
}

function moveBackward(vehicule) {

	if (vehicule.direction === "North") {
		vehicule.position.y++;
	} else if (vehicule.direction === "East") {
		vehicule.position.x--;
	} else if (vehicule.direction === "South") {
		vehicule.position.y--;
	} else {
		vehicule.position.x++;
	}

	// TO DRY
	let msg = vehicule.name + " current position is [" + vehicule.position.x + " " + vehicule.position.y + "] after moving backward on your input.";
	console.log(msg);

	moveCircle(vehicule.position.x, vehicule.position.y);
}

// find first available vehicule in the array (todo sort/filter) TODO if currentnull && none is active >> NO MORE VEHICULES
function defaultVehicule(arr){
	var found =	arr.find(function(element) {
		return element.isActive;
	});

	// assign found vehicule to vehicule
	currentVehicule = found;

	if (found) {
		// turn circle to green TODO precise circle selection for multiplayer
		document.dispatchEvent(event);

		// notify user
		hulla.send("Connected to " +  found.name + " by default.. ", "info");
		console.log("Connected to " +  found.name +  " by default.. ");
	} else {
		// if no more vehicule disable interface
		hulla.send("There is no more vehicules !");
		jQuery("#remote, #disconnect").prop("disabled", true); // Disables visually + functionally
		jQuery("#remote").addClass("btn-danger text-white");


	}
	return found;
}

// ======================
// Focus commands on User chosen rover or disconnect

function focusVehicule(arr, i) {
	// check if vehicule already online
	if (currentVehicule != null ){
		currentVehicule = arr[i];
	} else {
		currentVehicule = defaultVehicule(arr);
	}

	// turn it to green and notify
	document.dispatchEvent(event);
	hulla.send("Connected to " +  currentVehicule.name, "info");
	
	return currentVehicule;
}

function destroyVehicule() {

	// log and notify
	console.log(currentVehicule.name + "  was destroyed ! ");
	hulla.send(currentVehicule.name + "  was destroyed ! ", "danger");

	console.log("User disconnected from " + currentVehicule.name + ".");
	hulla.send("User disconnected from " + currentVehicule.name + ".", "dark");

	// turn it red
	document.dispatchEvent(event2);

	// disable destroyed vehicule into selected array and set currentVehicule to none..
	currentVehicule.isActive = false;

	// set current vehicule to none
	currentVehicule = null;
	
}

// change focused rover appearance, green for online, red for offline
document.addEventListener("roverOn", function () {
	var onlineVehicule = d3.select( "#vehicule" + currentVehicule._id )
		.classed("online-rover", true);
}, false);

document.addEventListener("roverOff", function () {
	var offlineVehicule = d3.select( "#vehicule" + currentVehicule._id )
		.classed("online-rover", false);
}, false);


// ======================
// Processing valid User commands from text input (lrfb)	
// Log sequence, user and timestamp into vehicule blackbox..
function readCmd(input, vehicule, operator) {

	// create a log message for the vehicule blackbox to save
	let date = new Date();
	date.toISOString();
	let log = "initiating sequence: " + input + " from " + operator.toUpperCase() + " on " + date;

	// send it as notification and save it to corresponding array
	console.log(log);
	hulla.send(log, "info");
	vehicule.blackBox.push(log);

	for (var i = 0; i < input.length; i++) {

		let value = input.charAt(i);
		if (value === "l") {
			turnLeft(vehicule);

		} else if (value === "r") {
			turnRight(vehicule);

		} else if (value === "f") {
			moveForward(vehicule);

		} else if (value === "b") {
			moveBackward(vehicule);
		} else {
			console.log(value + " is not a valid input, please use (f)orward, (b)ackward, (r)ight or (l)eft.");
			hulla.send(value + " is not a valid input, please use (f)orward, (b)ackward, (r)ight or (l)eft.");
		}

		// print current position when vehicule has executed it's last move 
		if (i === input.length - 1) {
			console.log(vehicule.name + " is currently located to [" + vehicule.position.x + ", " + vehicule.position.y + "] heading " + vehicule.direction);
		}
	}
}

// Process commands from keyboad to focused rover, set default if rover none has been selected through scenario button
// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function (e) {
	e = e || window.event;
	// if a rover is currently
	if (currentVehicule != null) {
		switch (e.which || e.keyCode) {
		case 37: // left
			turnLeft(currentVehicule);
			break;

		case 38: // up
			moveForward(currentVehicule);
			break;

		case 39: // right
			turnRight(currentVehicule);
			break;

		case 40: // down
			moveBackward(currentVehicule);
			break;

		default:
			return; // exit this handler for other keys
		}
	} else {
		
		// default Rover is the first available a given array. TODO dynamic array select (crafts, probes, shuttles..)
		currentVehicule = defaultVehicule(crafts); 
				
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
};

// ======================
// GUI
// basic grid setup
var width = 250,
	height = 250,
	resolution = 25,
	r = 25; // rover size

// pull data (x, y, name) for crafts[i] and map it on map
// https://stackoverflow.com/questions/16058791/d3-js-how-to-use-map-function
crafts.map(function (d) {
	return {
		x: d.position.x * width,
		y: d.position.y * height,
		name: d.name,
		_id: d._id,
	};
});

// create obstacles at random poditions 
var obstacles = d3.range(3).map(function () {
	return {
		x: round(Math.random() * width, resolution),
		y: round(Math.random() * height, resolution)
	};
});

// update current used rover position on GUI
function moveCircle(x, y) {
	
	// select corresponding rover circle  // see filter or direct selection https://d3indepth.com/selections/ && https://stackoverflow.com/questions/20414980/d3-select-by-attribute-value
	var selectedCircle = d3.select( "#vehicule" + currentVehicule._id ); 
	selectedCircle.transition()
		.duration(250)
		.attr("cx", x * r)
		.attr("cy", y * r)
		.ease("easebounce");

	// check if rover position equals an obstacle on each move 
	// TODO add zone area sensitivity to handle bigger obstacles
	obstacles.forEach(function (element) {
		if ((x == (element.x / r)) && (y == (element.y / r))) {

			var destroyedCircle = d3.select( "#vehicule" + currentVehicule._id );
			
			// remove and disable circle and vehicule
			destroyedCircle.remove();
			destroyVehicule();
		}
	});

}

// math max is enforcing bounds of draggable rovers TODO HELP apply to user input
function dragged(d) {
	var x = d3.event.x,
		y = d3.event.y,
		gridX = round(Math.max(r, Math.min(width - r, x)), resolution),
		gridY = round(Math.max(r, Math.min(height - r, y)), resolution);

	d3.select(this).attr("cx", d.x = gridX).attr("cy", d.y = gridY);
}

// add draggable behaviour (for further dev)
var drag = d3.behavior.drag()
	.origin(function (d) {
		return d;
	})
	.on("drag", dragged);

// rounding values
function round(p, n) {
	return p % n < n / 2 ? p - (p % n) : p + n - (p % n);
}

// **************************//
// **** EXERCISE RESULT **** //
// **************************//

// prompt for Rover choice and command sequence, default is rffrfflfrff, ask again if not valid
// TODO refactor to remove array selection, filter by type : probes, satellites, rockets instead..

function initScenarii(arr) {
	// list current enabled vehicules..
	let i;
	let list = [];
	for (i = 0; i < arr.length; i++) { 
		if (arr[i].isActive){
			list += "\n- (" + arr[i]._id + ") for Rover " +  arr[i].name;
		}
	}

	// ask user
	var probe = prompt("Please choose a vehicule* :" + list, "1");
	var operator = prompt("Please enter your name.");
	var cmd = prompt("Please enter Rover's sequence* :\n Available commands are :\n- (f)orward\n- (b)ackward\n- (l)eft\n- (r)ight", "zrffrfflfrff");

	
	if (!cmd) { // if commands is empty, TODO RECURSIVE ??
		cmd = prompt("Command sequence can't be empty...", "bbrff");
	}
	if (operator.length < 1) {
		operator = "GUEST"; // default user name

	} if (probe > probe.length || probe / probe != 1) { // probe validation
		probe = prompt("Please choose a valid probe* :" + list, "1");
		console.log(probe);
		hulla.send(probe);
	}

	readCmd(cmd, focusVehicule(arr, (probe - 1)), operator); // exec when params are ok
}

// **************************//
// *********** GUI ********* //
// **************************//
// Adapted from https://bl.ocks.org/danasilver/cc5f33a5ba9f90be77d96897768802ca

// do this stuff after page load
$(document).ready(function () {

	// data from distinct json file later
	// var craftsfromJSON = jQuery.getJSON( "../data.json", function( data ) {
	// 	console.log("data from file" + data);
	// 	console.log("data from js" + crafts);
	// 	return data;
	// });

	// create a canvas 
	var svg = d3.select("#grid").append("svg")
		.attr("width", width)
		.attr("height", height);

	// draw vertical lines TODO DRY UP
	svg.selectAll(".vertical")
		.data(d3.range(1, width / resolution))
		.enter().append("line")
		.attr("class", "vertical")
		.attr("x1", function (d) { return d * resolution; })
		.attr("y1", 0)
		.attr("x2", function (d) { return d * resolution; })
		.attr("y2", height)
		.each(function (d, i) {
			var odd = i % 2 === 0;
			d3.select(this)
				//.style("stroke", odd ? "" : "grey")  // color change
				.style("stroke-width", odd ? null : 1.75); // thicker line each 2
		});

	// horizontal lines TODO DRY UP
	svg.selectAll(".horizontal")
		.data(d3.range(1, height / resolution))
		.enter().append("line")
		.attr("class", "horizontal")
		.attr("x1", 0)
		.attr("y1", function (d) { return d * resolution; })
		.attr("x2", width)
		.attr("y2", function (d) { return d * resolution; })
		.each(function (d, i) {
			var odd = i % 2 === 0;
			d3.select(this)
				.style("stroke-width", odd ? null : 1.75); // thicker line each 2
		});

	// draw circle from data
	var circles = svg.selectAll("circle")
		.data(crafts)
		.enter().append("circle")
		.attr("cx", function (d) { return d.x; }) // bind coordinates, id and name to circles
		.attr("cy", function (d) { return d.y; })
		.attr("id", function(d){ return ("vehicule" + d._id); })
		.attr("label", function (d) { return d.name; })
		.attr("r", r / 2)
		.attr("transform", function (d) {return "translate(" + (resolution / 2) + "," + (resolution / 2) + ")"; 	}) // bypass circle position offset
		.classed("rover", true);
	//.call(drag); // make them draggable 

	// TODO ADD ORIENTATION ARROW TO ROVER... 

	// circles.append("text")
	// 	.data(crafts)
	// 	.attr("class", "rover")
	// 	.attr("text-anchor", "middle")
	// 	.attr("cx",  function(d) { return d.x; })
	// 	.attr("cy",  function(d) { return d.y; })
	// 	.attr("font-family", "Arial")
	// 	.attr("font-size", "16px")
	// 	.attr("fill", "black")
	// 	.text(function(d) { return d.name; })
	// 	.attr("transform", function(d) { return "translate(" + round(d.position.x * width, resolution) + "," + round(d.position.y * width, resolution) + ")"; });

	// display rovers name on map 
	// https://www.dashingd3js.com/svg-text-element
	// http://bl.ocks.org/ChrisJamesC/4474971
	var text = svg.selectAll("text")
		.data(crafts)
		.enter()
		.append("text");

	// TODO UPDATE TEXT POSITION WITH ROVERS
	var textLabels = text
		.attr("x", function (d) {
			return d.position.x;
		})
		.attr("y", function (d) {
			return d.position.y;
		})
		.text(function (d) {
			return d.name;
		})
		.attr("font-family", "Arial")
		.attr("font-size", "16px")
		.attr("fill", "black")

	var worries = svg.selectAll("obs")
		.data(obstacles)
		.enter().append("path")
		.attr("d", d3.svg.symbol().type("triangle-up").size(r * 10))
		.attr("transform", function (d) { return "translate(" + (d.x + resolution / 2) + "," + (d.y + resolution / 2) + ")"; }) // bypass circle position offset
		.style("fill", "grey");

}); // end of window load

// TODO ENFORCING BOUNDARIES https://bl.ocks.org/mbostock/1557377
// ORIENTATION CLUES and text
// TODO add a Zoom option https://bl.ocks.org/mbostock/6123708
// TODO React + SocketIO/Firebase https://stackblitz.com/edit/react-rover

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