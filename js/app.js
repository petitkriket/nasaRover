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
		"x": 0,
		"y": 0
	}
},
];


// wish to get data from a json file but not working..

// var craftsfromJSON = jQuery.getJSON( "../data.json", function( data ) {
// 	console.log("data from file" + data);
// 	console.log("data from js" + crafts);
// 	return data;
// });
// console.log("readed data from getJSON" + craftsfromJSON);


// libs
var hulla;
var d3;

// user is connected to no Rover by default
var currentRover = null;

// trigger events when a Rover is selected (to turn it green) or red when turned offline.
var event = new Event('roverSelection');
var event2 = new Event('roverDisconnected');

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
		vehicule.position.x += 0;
		vehicule.position.y -= 1;
	} else if (vehicule.direction === "East") {
		vehicule.position.x += 1;
		vehicule.position.y += 0;
	} else if (vehicule.direction === "South") {
		vehicule.position.x += 0;
		vehicule.position.y += 1;
	} else {
		vehicule.position.x -= 1;
		vehicule.position.y += 0;
	}

	// TO DRY
	let msg = vehicule.name + " current position is [" + vehicule.position.x + " " + vehicule.position.y + "] after moving forward on your input.";
	console.log(msg);

	moveCircle(vehicule._id, vehicule.position.x, vehicule.position.y);
}

function moveBackward(vehicule) {

	if (vehicule.direction === "North") {
		vehicule.position.x += 0;
		vehicule.position.y += 1;
	} else if (vehicule.direction === "East") {
		vehicule.position.x -= 1;
		vehicule.position.y += 0;
	} else if (vehicule.direction === "South") {
		vehicule.position.x += 0;
		vehicule.position.y -= 1;
	} else {
		vehicule.position.x += 1;
		vehicule.position.y += 0;
	}

	// TO DRY
	let msg = vehicule.name + " current position is [" + vehicule.position.x + " " + vehicule.position.y + "] after moving backward on your input.";
	console.log(msg);

	moveCircle(vehicule._id, vehicule.position.x, vehicule.position.y);
}

// ======================
// Focus commands on User chosen rover or disconnect

function focusVehicule(arr, i) {
	if ((arr === "disconnect") && (i == null)) {

		// send log and notification
		let msg = "User disconnected from " + currentRover.name + ".";
		console.log(msg);
		hulla.send(msg, "dark");

		// back to no controlled rover
		currentRover = null;

	} else {
		console.log("User connected to " + arr[i].name + ".");
		currentRover = arr[i];
		document.dispatchEvent(event);
	}
	return currentRover;
}

// ======================
// Processing valid User commands from text input (lrfb)	
// Log sequence, user and timestamp into vehicule blackbox..
function readCmd(input, vehicule, operator) {

	// log cmd into blackbox array and send notification
	let log = "initiating sequence: " + input + " from " + operator.toUpperCase() + " on :'' " + Math.round((new Date()).getTime() / 1000);
	console.log(log);
	vehicule.blackBox.push(log);
	hulla.send(log, "info");

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
		}

		// print current position when vehicule has executed it's last move 
		if (i === input.length - 1) {
			console.log(vehicule.name + " is currently located to [" + vehicule.position.x + ", " + vehicule.position.y + "] heading " + vehicule.direction);
		}
	}
}

// cmd from keyboad to online rover, set default if none
// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function (e) {
	e = e || window.event;
	if (currentRover != null) {
		switch (e.which || e.keyCode) {
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

		default:
			return; // exit this handler for other keys
		}
	} else {
		alert("No rover was selected !\nConnecting on Rover Opportunity by default..");
		currentRover = crafts[0]; // default Rover is the first of array.
		document.dispatchEvent(event);
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
};

// ======================
// GUI
// basic grid setup, best results with square x^2 and x/10
var width = 250,
	height = 250,
	resolution = 25,
	r = 25; // rover size

// pull data (x, y, name) for crafts[i]
// https://stackoverflow.com/questions/16058791/d3-js-how-to-use-map-function
crafts.map(function (d) {
	return {
		x: round(d.position.x * width, resolution),
		y: round(d.position.y * height, resolution),
		name: d.name,
	};
});

// create random obstacles
var obstacles = d3.range(3).map(function () {
	return {
		x: round(Math.random() * width, resolution),
		y: round(Math.random() * height, resolution)
	};
});

// update current used rover position on GUI
function moveCircle(roverId, x, y) {
	var circle = d3.selectAll("circle")
		.filter(function (d, i) {
			return i === roverId; // https://d3indepth.com/selections/
		});
	circle.transition()
		.duration(250)
		.attr("cx", x * r)
		.attr("cy", y * r)
		.ease("easebounce");

	// check if rover position equals an obstacle (TODO  add zone area sensitivity)
	obstacles.forEach(function (element) {
		if ((x == (element.x / r)) && (y == (element.y / r))) {

			// notify, disconnect
			hulla.send("Rover was destroyed ! ", "danger");
			focusVehicule("disconnect");
			document.dispatchEvent(event2)

			// TODO REMOVE MARKER
			var destroyedCircle = d3.selectAll("circle")
				.filter(function (d, i) {
					return i === roverId; // https://d3indepth.com/selections/
				});
			destroyedCircle.remove();

		}
	});

}

// change circle color according to rover's status
document.addEventListener("roverSelection", function () {
	var circle = d3.select("circle")
		.classed("online-rover", true);
}, false);

// disconnect rover	and turn it red on event TODO disconnect from specific rover (multiplayer)
document.addEventListener("roverDisconnected", function () {
	var circle = d3.select("circle")
		.classed("online-rover", false);
	focusVehicule("disconnect");
}, false);

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

// Start emitting exercise scenario on User click:
// prompt for Rover choice and command sequence, default is rffrfflfrff, ask again if not valid
// TODO refactor to remove array selection, filter by type : probes, satellites, rockets instead..

function initScenarii(arr) {

	// TODO BUGGY HELP loop trhough array to create a list of available Rovers for User prompt according to JSON data

	// let list = []; 
	// arr.forEach(function(i) {
	// 	list.push(arr.join(i.name + ",\n "));
	// });
	// var probe = prompt("Please choose a probing vehicule:"+ list );

	var probe = prompt("Please choose a probing vehicule* :\n- 1 for Opportunity Rover\n- 2 for Dedication Rover", "1");
	var operator = prompt("Please enter your name.");
	var cmd = prompt("Please enter Rover's sequence* :\n Available commands are :\n- (f)orward\n- (b)ackward\n- (l)eft\n- (r)ight", "zrffrfflfrff");

	// if commands were inputed and probe is a valid vehicule id then exec, else ask again..
	if (!cmd) {
		cmd = prompt("Command sequence can't be empty...", "bbrff");

	}
	if (operator.length < 1) {
		operator = "GUEST";

	} else if (probe.length < 1) {
		var probe = prompt("Please choose a valid probe* : \n- 1 for Opportunity Rover\n - 2 for Dedication Rover", "1");
	}

	readCmd(cmd, focusVehicule(arr, (probe - 1)), operator); // exec prompted command when all params are ok
}

// **************************//
// *********** GUI ********* //
// **************************//
// Adapted from https://bl.ocks.org/danasilver/cc5f33a5ba9f90be77d96897768802ca

// do this stuff after page load
$(document).ready(function () {

	// create a canvas 
	var svg = d3.select("#grid").append("svg")
		.attr("width", width)
		.attr("height", height);

	// draw vertical lines TODO DRY UP
	svg.selectAll(".vertical")
		.data(d3.range(1, width / resolution))
		.enter().append("line")
		.attr("class", "vertical")
		.attr("x1", function (d) {
			return d * resolution;
		})
		.attr("y1", 0)
		.attr("x2", function (d) {
			return d * resolution;
		})
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
		.attr("y1", function (d) {
			return d * resolution;
		})
		.attr("x2", width)
		.attr("y2", function (d) {
			return d * resolution;
		})
		.each(function (d, i) {
			var odd = i % 2 === 0;
			d3.select(this)
				.style("stroke-width", odd ? null : 1.75); // thicker line each 2
		});

	// draw circle from  data
	var circles = svg.selectAll("circle")
		.data(crafts)
		.enter().append("circle")
		.attr("cx", function (d) {
			return d.x;
		})
		.attr("cy", function (d) {
			return d.y;
		})
		.attr("label", function (d) {
			return d.name;
		})
		.attr("r", r / 2)
		.attr("transform", function (d) {
			return "translate(" + (resolution / 2) + "," + (resolution / 2) + ")";
		}) // bypass circle position offset
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
		.attr("fill", "black");
	//.attr("transform", function(d) { return "translate(" + round(d.position.x * width, resolution) + "," + round(d.position.y * width, resolution) + ")"; });

	var worries = svg.selectAll("obs")
		.data(obstacles)
		.enter().append("path")
		.attr("d", d3.svg.symbol().type("triangle-up").size(r * 10))
		//.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }) // obstacles on grid crossings
		.attr("transform", function (d) {
			return "translate(" + (d.x + resolution / 2) + "," + (d.y + resolution / 2) + ")";
		}) // bypass circle position offset
		.style("fill", "grey");

}); // end of window load

// TODO ENFORCING BOUNDARIES https://bl.ocks.org/mbostock/1557377
// ORIENTATION CLUES
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