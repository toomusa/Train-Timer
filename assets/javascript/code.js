var config = {
    apiKey: "AIzaSyDRTV5kQYCdd4MdBG9y_OOH3_QmiXrV9dQ",
    authDomain: "ucbcb-train-timer.firebaseapp.com",
    databaseURL: "https://ucbcb-train-timer.firebaseio.com",
    projectId: "ucbcb-train-timer",
    storageBucket: "",
    messagingSenderId: "147542379843",
    appId: "1:147542379843:web:d5b9e04cc77631db"
  };
  
firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("value", function(snapshot) {
    $("#new-row tr:not(:first-child)").remove();
    const trains = snapshot.val();
    
    for (let key in trains) {
        trainName = trains[key].Train_Name;
        destination = trains[key].Destination;
        frequency = trains[key].Frequency;
        nextArrival = trains[key].Next_Arrival;
        minutesAway = trains[key].Minutes_Away;

        $trainName = $("<td>").text(trainName);
        $destination = $("<td>").text(destination);
        $frequency = $("<td>").text(frequency);
        $nextArrival = $("<td>").text(nextArrival);
        $minutesAway = $("<td>").text(minutesAway);
    
        $newRow = $("<tr>").append($trainName, $destination, $frequency, $nextArrival, $minutesAway);
        $("#new-row").append($newRow);
    }
});

$("#submit").on("click", function(event) {
    event.preventDefault();
  
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstTrain = $("#train-time-input").val().trim();

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var currentTime = moment();   
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    var tRemainder = diffTime % frequency;  
    minutesAway = JSON.stringify(tRemainder);
    
    var tMinutesTillTrain = frequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");  
    nextArrival = moment(nextTrain).format("hh:mm A");
  
    database.ref().push({
        Train_Name: trainName,
        Destination: destination,
        Frequency: frequency,
        Next_Arrival: nextArrival, 
        Minutes_Away: minutesAway
    })
});
