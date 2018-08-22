// Initialize Firebase
var config = {
    apiKey: "AIzaSyBblANmtIQuZTTvQaTZ44ukGKn3WkzVcuE",
    authDomain: "baseline-project-one.firebaseapp.com",
    databaseURL: "https://baseline-project-one.firebaseio.com",
    projectId: "baseline-project-one",
    storageBucket: "",
    messagingSenderId: "471965093855"
  };

firebase.initializeApp(config);

// Creating a variable to reference the database.
var database = firebase.database();


// User clicks photo upload button
$("#photoUploadButton").on("click", function uploadePicturePopUp () {

    // This on click event will create a pop up of the user's computer files so that they can find their picture file and upload it into the application.

});


$("#formSubmitButton").on("click", function grabUserSubmission(event) {

    event.preventDefault();

    var userName = $("#userName").val.trim;
    var lookingSelect1
    var userCommentsText = $("#userCommentsText").val.trim;


    // Store user information in firebase
    database.ref().push({
    UserName: userName,
    JobSeeking: lookingSelect1,
    UserComments: userCommentsText
    });
    

})


// An AJAX request is sent to Face ++ and the results are shown in the results div
function showResults() {

    var userPicture = $("img");
    var queryURL 

    // Empty the results div before putting new results each time the function gets called
    $("#results-appear-here").empty();

    // Send out an AJAX call to Face ++ using the user input's upload
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // Find out which parameters are needed from the Face ++ response (i.e. confidence, beauty, happiness etc)

        var results = response.data;

        var confidence = results.confidence.rating;
        var beauty = results.beauty.rating;
        var happiness = results.happiness.rating;

        $("#results-appear-here").append(confidence, beauty, happiness);

        }
    )};