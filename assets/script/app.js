//Initialize firebase
var config = {
    apiKey: "AIzaSyA4CVIv5Icjb7YTOOJH4xi4VZ5IT5l7tSs",
    authDomain: "trainschedule-2fa64.firebaseapp.com",
    databaseURL: "https://trainschedule-2fa64.firebaseio.com",
    projectId: "trainschedule-2fa64",
    storageBucket: "trainschedule-2fa64.appspot.com",
    messagingSenderId: "803160175521"
  };
  firebase.initializeApp(config);

  //Creating a varible to reference to the database
  var database = firebase.database();

  //I need to define the values in the database i created - make a variable with a blank value for each input
  var name = "";
  var destination = "";
  var firstTrain = "";
  var frequency = "";
  

//Capture Values through a buttion click
$("#addTrain").on("click", function(event){
	event.preventDefault();


//Now im going to grab the values that aree typed in the inputs
name = $("#name-input").val().trim();
destination = $("#destination-input").val().trim();
firstTrain = $("#firstTrain-input").val().trim();
frequency = $("#frequency-input").val().trim();

//create a variable to handle the data grabbed and push it into the database

var objectToPush = {
name: name,
destination: destination,
frequency: frequency,
firstTrain: firstTrain,
dateAdded: firebase.database.ServerValue.TIMESTAMP
}

database.ref().push(objectToPush);
});

//This is called a firebase watcher.. 
//it will watch the changes without overhead and adds an order an limit to it

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
	//this is how im storing and targeting the data
	var sv = snapshot.val();
	//console.log(sv.name);
	//console.log(sv.frequency);
	//console.log(sv.destination);

	//i want to put the value in the display area
	//prepend means before where im targeting
	//append means after

	$("#name-display").append("<p>" + sv.name + "</p>");
	$("#destination-display").append("<p>" + sv.destination + "</p>");
	$("#firstTrain-display").append("<p>" + sv.firstTrain + "</p>");
	$("#frequency-display").append("<p>" + sv.frequency + "</p>");
	$("#arrival-display").append("<p>" + moment(nextTrain).format("hh:MM") + "</p>");


	var firstTrainMoment = moment(snapshot.val().firstTrainTime, "hh:mm").subtract(1000, "minutes");
	var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
	var remainder = diffTime % snapshot.val().frequency;
	var minUntilTrain = snapshot.val().frequency - remainder;
	var nextTrain = moment().add(minUntilTrain, "minutes");



}), function(errorObject) {
	console.log("error handled: " +errorObject.code);
}
