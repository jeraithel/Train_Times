var config = {
    apiKey: "AIzaSyAG-cZXcq1Ypjxu1l1kxhadjVV2dP81s4w",
    authDomain: "carrotawesome-b8f04.firebaseapp.com",
    databaseURL: "https://carrotawesome-b8f04.firebaseio.com",
    projectId: "carrotawesome-b8f04",
    storageBucket: "carrotawesome-b8f04.appspot.com",
    messagingSenderId: "553196502647"
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
// var database = ...

var database = firebase.database();

var trainName = "";
var trainDestination = "";
var trainFirstTime = "12:00 PM";
var trainFrequency = 0;


// Capture Button Click
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    trainName = $("#train-name").val().trim();
    trainDestination = $("#train-destination").val().trim();
    trainFirstTime = $("#train-first-time").val().trim();
    trainFrequency = $("#train-frequency").val().trim();

    // Code for handling the push
    database.ref().child("Trains").push({
      trainName: trainName,
      trainDestination: trainDestination,
      trainFirstTime: trainFirstTime,
      trainFrequency: trainFrequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

  });

// Firebase watcher .on("child_added"
database.ref().child("Trains").on("child_added", function(snapshot) {
    console.log("Fuck Yeah!");
    
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console.logging the last user's data
    console.log(sv.trainName);
    console.log(sv.trainDestination);
    console.log(sv.trainFirstTime);
    console.log(sv.trainFrequency);

    console.log("Hours: " + moment().hour());
    console.log("Minutes: " + moment().minute());

    var currentMinutes = 60*moment().hour() + moment().minute();
    var splitTime = sv.trainFirstTime.split(/:/);
    console.log(splitTime);
    var firstTrainMinutes = 60*parseInt(splitTime[0]) + parseInt(splitTime[1]);

    var nextTime = firstTrainMinutes;
    console.log (nextTime);
    // nextTimeHours = nextTime.getHours();
    // console.log (nextTimeHours);

    // nextTime = moment(sv.trainFirstTime);
    // console.log(nextTime);
    // var nextArrival = moment(0);
    // console.log (nextArrival);   
    // var minutesAway = 0;
    // console.log ("Diff: " + nextArrival + "  -  " + nextTime);

    while (nextTime < 1440) {
        console.log ("Start of While next Time" + nextTime);
        console.log ("Current Minutes: " + currentMinutes);
        if (nextTime > currentMinutes) {
            nextArrival = nextTime;
            minutesAway = nextArrival - currentMinutes;
            console.log ("Next Arrival: " + nextArrival);
            console.log ("Minutes Away: " + minutesAway);
            nextTime = 1500;
        }
        else {
            nextTime = nextTime + parseInt(sv.trainFrequency);
            console.log ("Stepping to Next Time: " + nextTime);
        }
    }

    nextArrivalHours = parseInt(Math.floor(nextArrival/60));
    nextArrivalMinutes = parseInt(nextArrival % 60);

    console.log("Hours: " + nextArrivalHours)
    console.log("Minutes: " + nextArrivalMinutes);
    nextArrival = nextArrivalHours + ":" + nextArrivalMinutes + " AM";
    console.log (nextArrival);

    if (nextArrivalHours < 12 & nextArrivalMinutes < 10) {
        console.log("path1");
        nextArrival = nextArrivalHours + ":0" + nextArrivalMinutes + " AM";
    }
    else if (nextArrivalHours == 12 & nextArrivalMinutes < 10) {
        console.log("path2");
        nextArrival = nextArrivalHours + ":0" + nextArrivalMinutes + " PM";
    }
    else if (nextArrivalHours > 12 & nextArrivalMinutes < 10) {
        console.log("path3");
        nextArrival = nextArrivalHours-12 + ":0" + nextArrivalMinutes + " PM";
    }
    else if (nextArrivalHours < 12 & nextArrivalMinutes > 9) {
        console.log("path4");
        nextArrival = nextArrivalHours + ":" + nextArrivalMinutes + " AM";
    }
    else if (nextArrivalHours == 12 & nextArrivalMinutes > 9) {
        console.log("path5");
        nextArrival = nextArrivalHours + ":" + nextArrivalMinutes + " PM";
    }
    else {
        console.log("path6");
        nextArrival = nextArrivalHours-12 + ":" + nextArrivalMinutes + " PM";
    }
    

    // Change the HTML to reflect
    var markup = "<tr><td>" + sv.trainName + "</td><td>" + sv.trainDestination + "</td><td>" + sv.trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>";
    console.log(markup);
    $("table tbody").append(markup);

    $(".form-control").val("");

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
