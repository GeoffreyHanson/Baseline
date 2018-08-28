// Initialize Firebase
var config = {
    apiKey: "AIzaSyBblANmtIQuZTTvQaTZ44ukGKn3WkzVcuE",
    authDomain: "baseline-project-one.firebaseapp.com",
    databaseURL: "https://baseline-project-one.firebaseio.com",
    authDomain: "baseline-project-one.firebaseapp.com",
    projectId: "baseline-project-one",
    storageBucket: "",
    messagingSenderId: "471965093855"
  };

firebase.initializeApp(config);

// Creating a variable to reference the database.
var database = firebase.database();

// Authentication Code
// const txtEmail = document.getElementById('txtEmail');
// const txtPassword = document.getElementById('txtPassword');
// const btnLogin = document.getElementById('btnLogin');
// const btnSignup = document.getElementById('btnSignup');
// const btnLogout = document.getElementById('btnLogout');

//   // Add login event
//   btnLogin.addEventListener('click', e => {
//       // Get email and pass
//       const email = txtEmail.value;
//       const pass = txtPassword.value;
//       const auth = firebase.auth();
//       // Sign in
//       const promise = auth.signInWithEmailAndPassword(email, pass);
//       promise.catch(e => console.log(e.message));
//   });
  
//   // Add signup event
//   btnSignup.addEventListener('click', e => {
//       // Get email and pass
//       // verify email input
//       const email = txtEmail.value;
//       const pass = txtPassword.value;
//       const auth = firebase.auth();
//       // Sign in
//       const promise = auth.createUserWithEmailAndPassword(email, pass);
//       promise.catch(e => console.log(e.message));
//   });        

//   btnLogout.addEventListener('click', e=> {
//       firebase.auth().signOut();
//   });

//   // Add a realtime listener
//   firebase.auth().onAuthStateChanged(firebaseUser => {
//     if(firebaseUser) {
//         console.log(firebaseUser);
//         btnLogout.classList.remove('hide');
//     } else {
//         console.log('not logged in');
//         btnLogout.classList.add('hide');
//     }
//   });

$("#modalTrigger").on("click", function(event){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          document.getElementById('userName').textContent = displayName;
        } else {
          document.getElementById('userName').textContent = "Not logged in";
        }
    });
});

$("#formSubmitButton").on("click", function () {
    
    // Grabbing user info
    var userName = $("#userName").val().trim();
    var lookingSelect1 = $("#lookingSelect1");
    var userCommentsText = $("#userCommentsText").val().trim();

    var newUser = {
        UserName: userName,
        JobSeeking: lookingSelect1,
        UserComments: userCommentsText
    };

    console.log(newUser);
    database.ref("/userComments").push(newUser);

    // fileInput.addEventListener('change', function() {
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
            database.ref("/userPictures").push({
                UserPicture: processedFile,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
           
        };
        // Read the file, which triggers the callback after the file is compete.
        fileReader.readAsDataURL(file); 
        
        document.getElementById("userInfo").reset();
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
                
                
                $("#pastResults").append(
                    $("<p>").text("The average user is "+greatestEmotionVal+"% sure you display "+greatestEmotion+"."),                    
                );
            }
            apparentEmotion();

            // Grabs appraisal of beauty from both male and female perspectives 
            function appraiseBeauty() {
                
                var beautyRatingM = response.faces[0].attributes.beauty.male_score;
                var beautyRatingF = response.faces[0].attributes.beauty.female_score;
                console.log("From a male perspective: " + beautyRatingM);
                console.log("From a female perspective: " + beautyRatingF);

                $("#pastResults").append(
                    $("<p>").text("The average man thinks you are more attractive than "+beautyRatingM+"% of the population."),
                    $("<p>").text("The average woman thinks you are more attractive than "+beautyRatingF+"% of the population."),
                );
            }
            appraiseBeauty();
        });
    }
    analyzation();
    
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

    database.ref("/userPictures").on("child_added", function(snapshot) {

    userPictureBase64 = snapshot.val().UserPicture;
    timeAdded = snapshot.val().dateAdded;

    $("#pastResults").append("Past Picture: " + `<img id='FirebasePicture' src='${userPictureBase64}' width='50%'> <br>`);
    $("#pastResults").append("Date Added: " + timeAdded + "<br>");

})
});