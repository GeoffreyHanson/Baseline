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

// Function for grabbing user's input photo and putting it on our browser

function handleFiles (files) {

    var file = fileInput.files[0]

    if (!file.type.startsWith('image/')){ continue }

    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed




}


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
    


});


    // Function that analyses photos 
    function analyzation() {

        $("#pastResults").empty();

        // var queryURL = "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=lz8ktVyjNIS7RKDBmUNPB-eZJmYEuMyv&api_secret=Y-mLOWm_EKKpc-JoB3FOEBC8Oi69V73q&image_url=https://scontent-ort2-1.xx.fbcdn.net/v/t31.0-8/11053925_10203331535969551_736538796961008347_o.jpg?_nc_cat=0%26oh=00ffca001c5a8dbdfcd132149fc3c9da%26oe=5C009316&return_attributes=beauty,emotion";
        // test image
        var imageURL = "https://scontent-ort2-1.xx.fbcdn.net/v/t31.0-8/11053925_10203331535969551_736538796961008347_o.jpg?_nc_cat=0%26oh=00ffca001c5a8dbdfcd132149fc3c9da%26oe=5C009316";
        var queryURL = "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=lz8ktVyjNIS7RKDBmUNPB-eZJmYEuMyv&api_secret=Y-mLOWm_EKKpc-JoB3FOEBC8Oi69V73q&image_url="+ imageURL +"&return_attributes=beauty,emotion";
        

        $.ajax({
            url: queryURL,
            method: "POST",       
        }).then(function(response) {
            
            console.log(response);
            // Loops through faces object, listing the most confident emotion.
            function apparentEmotion() {

                var greatestEmotionVal = 0;
                var greatestEmotion = "";                    
                var emotions = response.faces[0].attributes.emotion;            

                for (emotion in emotions) {              
                    if (emotions[emotion] > greatestEmotionVal) {
                        var greatestEmotionVal = emotions[emotion]; 
                        var greatestEmotion = emotion;
                    }                              
                }
                console.log(greatestEmotionVal);
                console.log(greatestEmotion);
                
                $("#pastResults").append(greatestEmotionVal);
                $("#pastResults").append(greatestEmotion);
            }
            apparentEmotion();

            // Grabs appraisal of beauty from both male and female perspectives 
            function appraiseBeauty() {
                
                var beautyRatingM = response.faces[0].attributes.beauty.male_score;
                var beautyRatingF = response.faces[0].attributes.beauty.female_score;
                console.log("From a male perspective: " + beautyRatingM);
                console.log("From a female perspective: " + beautyRatingF);

                $("#pastResults").append(beautyRatingM);
                $("#pastResults").append(beautyRatingF);
            }
            appraiseBeauty();
        });
    }
    analyzation();


     /// LinkedIn Photo upload
     api_key =  "78kyu7q93daep2";
     onLoad =  OnLinkedInFrameworkLoad;
     authorize = true;
    
    
    function onLinkedInLoad() {

    };
    
    // submit photo to linkedin profile
    function OnLinkedInFrameworkLoad() {
     IN.Event.on(IN, "auth", OnLinkedInAuth);
   }
   // if authorized bring to linkedIn profile
   function OnLinkedInAuth() {
     IN.API.Profile("me").result(ShowProfileData);
 };
 //show user linkedin profile
 function ShowProfileData(profiles) {
   var member = profiles.values[0];
   var id=member.id;
   var firstName=member.firstName;
   var lastName=member.lastName;
   var photo=member.pictureUrl;
   var headline=member.headline;

   //use information captured above
   console.log(member)
};

// Get the file element
let fileInput = document.querySelector('#image-file');

fileInput.addEventListener('change', function() {
    let file = fileInput.files[0];

    // Create a new File Reader
    let fileReader = new FileReader();
    
    // Set the 'onload' callback.
    fileReader.onload = function (event) {
        let processedFile = event.target.result;

        // Console the base 64 string
        console.log(processedFile);
    
        $("#userPhoto").html("<img id='Picture'>");
        $("#Picture").attr({
            'src': processedFile,
            'width':'100%'});

        // Put into firebase storage.
       
    };
    
    // Read the file, which triggers the callback after the file is compete.
    fileReader.readAsDataURL(file);
});
