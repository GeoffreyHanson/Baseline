// Initialize Firebase
var config = {
    apiKey: "AIzaSyBblANmtIQuZTTvQaTZ44ukGKn3WkzVcuE",
    authDomain: "baseline-project-one.firebaseapp.com",
    databaseURL: "https://baseline-project-one.firebaseio.com",
    authDomain: "baseline-project-one.firebaseapp.com",
    projectId: "baseline-project-one",
    storageBucket: "baseline-project-one.appspot.com",
    messagingSenderId: "471965093855"
  };

firebase.initializeApp(config);

// Creating a variable to reference the database.
var database = firebase.database();
var displayName = "Not logged in";
var processedFile = ""

$("#modalTrigger").on("click", function(event){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          displayName = user.displayName;
          document.getElementById('userName').textContent = displayName;
        } else {
          document.getElementById('userName').textContent = "Not logged in";
        }
    });
});

$("#formSubmitButton").on("click", function () {
    
    // Grabbing user info
    var userName = displayName;
    var lookingSelect1 = $("#lookingSelect1").val();
    var userCommentsText = $("#userCommentsText").val().trim();

    var newUser = {
        UserName: userName,
        JobSeeking: lookingSelect1,
        UserComments: userCommentsText
    };


    
    // console.log(newUser);
    database.ref("/userComments").push(newUser);
    
    // Get the file element
    var fileInput = document.querySelector('#image-file');
    
    // Select file from the input
    var file = fileInput.files[0];
    console.log(file);        
    
    // onload function 1st
    // Create a new File Reader
    let fileReader = new FileReader();  
    
    // Set the 'onload' callback.
    fileReader.onload = function (event) {
        //let 
        processedFile = event.target.result;

        // Console the base 64 string
        // console.log(processedFile);
    
        $("#userPhoto").html("<img id='Picture'>");
        $("#Picture").attr({
            'src': processedFile,
            'width':'100%'});

        // // Put into firebase storage.
        // database.ref("/userPictures").push({
        //     UserPicture: processedFile,
        //     UserName: userName,
        //     JobSeeking: lookingSelect1,
        //     UserComments: userCommentsText,
        //     dateAdded: firebase.database.ServerValue.TIMESTAMP
        // });
        
    };

    // Read the file, which triggers the callback after the file is compete.
    fileReader.readAsDataURL(file); 
    
    document.getElementById("userInfo").reset();

    // ----------------------------------
    // Put into firebase storage.                
    var storageRef = firebase.storage().ref(file.name);
    storageRef.put(file);

    // url function 2nd
    storageRef.getDownloadURL().then(function(url) {
        var imageURL = url;
            
        // Analyzation of photos 
        $("#pastResults").empty();
        
        console.log(imageURL); 
        // Grabbing the image from the page 
        var queryURL = "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=lz8ktVyjNIS7RKDBmUNPB-eZJmYEuMyv&api_secret=Y-mLOWm_EKKpc-JoB3FOEBC8Oi69V73q&image_url="+ imageURL +"&return_attributes=beauty,emotion";
        
        
        $.ajax({
            url: queryURL,
            method: "POST",       
        }).then(function(response) {
            
            console.log(response);
            // Loops through faces object, listing the most confident emotion.
        

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
                
                
                $("#pastResults").append(
                    $("<p>").text("The average user is "+greatestEmotionVal+"% sure you display "+greatestEmotion+"."),                    
                );


                // Grabs appraisal of beauty from both male and female perspectives                    
                var beautyRatingM = response.faces[0].attributes.beauty.male_score;
                var beautyRatingF = response.faces[0].attributes.beauty.female_score;
                console.log("From a male perspective: " + beautyRatingM);
                console.log("From a female perspective: " + beautyRatingF);
          
                $("#pastResults").append(
                    $("<p>").text("The average man thinks you are more attractive than "+beautyRatingM+"% of the population."),
                    $("<p>").text("The average woman thinks you are more attractive than "+beautyRatingF+"% of the population."),
                );

            // Put into firebase storage.
            database.ref(`${displayName}/userPictures`).push({
            UserPicture: processedFile,
            UserName: userName,
            JobSeeking: lookingSelect1,
            UserComments: userCommentsText,
            GreatestEmotion: greatestEmotion,
            GreatestEmotionVal: greatestEmotionVal,
            BeautyRatingM: beautyRatingM,
            BeautyRatingF: beautyRatingF,
            dateAdded: firebase.database.ServerValue.TIMESTAMP        
          
//        }
//            appraiseBeauty();
//        });
//    }
//    analyzation();
        });
        });
    });  
});

              
              
    //let imageData = "";
let verifyImage = "";

var webcamModule = function() {
  var streaming = false;
  var video = null;

  // image return

  // console.log("TEST" +imageData);

  (function() {
    video = document.getElementById("webcamVideo");
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
        localStream = stream.getTracks()[0];
      })
      .catch(function(err) {
        console.log(err);
      });
    video.addEventListener(
      "canplay",
      function(ev) {
        if (!streaming) {
          video.setAttribute("width", "600");
          video.setAttribute("height", "450");
          streaming = true;
        }
        var captureInterval = 5000;
        var countdown = captureInterval / 1000;
        var counterFunction = setInterval(function() {
          $("#showCounter").html(countdown);

          //Take the picture
          if (countdown <= 0) {
            takepicture(video);
            clearInterval(counterFunction);
            localStream.stop();
          }
          countdown--;
        }, 1000);
      },
      false
    );
  })();

  console.log("verify image: " + verifyImage);
};

var takepicture = function(video) {
  $("#showCounter").html("Retrieving data...");
  var canvas = document.createElement("CANVAS");
  var context = canvas.getContext("2d");
  canvas.width = "600";
  canvas.height = "450";
  // draw video image onto canvas, get data
  context.drawImage(video, 0, 0);
  var imageData = canvas.toDataURL("image/png");
  $("#showCounter").html("See image data in console.");
  $(video).hide();
  console.log(imageData); ///return

  //return imageData;
  verifyImage = imageData.split(",")[1];

  //Copy image data
};









// Get the file element
let fileInput = document.querySelector('#image-file');



$("#pastResultsButton").on("click", function(event){

    event.preventDefault();

    database.ref(`${displayName}/userPictures`).on("child_added", function(snapshot) {

    userPictureBase64 = snapshot.val().UserPicture;
    timeAdded = snapshot.val().dateAdded;
    jobSeeking = snapshot.val().JobSeeking;
    userCommentsText = snapshot.val().UserComments;
    greatestEmotion = snapshot.val().GreatestEmotion;
    greatestEmotionVal = snapshot.val().GreatestEmotionVal;
    beautyRatingM = snapshot.val().BeautyRatingM;
    beautyRatingF = snapshot.val().BeautyRatingF;
    // GreatestEmotion: greatestEmotion,
    // GreatestEmotionVal: greatestEmotionVal,
    // BeautyRatingM: beautyRatingM,
    // BeautyRatingF: beautyRatingF,

    $("#pastResults").append("<br>Past Picture:<br>" + `<img id='FirebasePicture' src='${userPictureBase64}' width='50%'> <br>`);
    $("#pastResults").append("Seeking a New Job? " + jobSeeking + "<br>");
    $("#pastResults").append("User Comments: " + userCommentsText + "<br>");
    $("#pastResults").append("Male Rating: " + beautyRatingM + " percentile<br>");
    $("#pastResults").append("Female Rating: " + beautyRatingF + " percentile<br>");
    $("#pastResults").append(greatestEmotionVal + "% certainty of emotion: " + greatestEmotion + "<br>");
    $("#pastResults").append("Date Added: " + timeAdded + "<br>");

})
});