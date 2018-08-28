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
        });
    });  
});


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






$("#pastResultsButton").on("click", function(event){

    event.preventDefault();

    database.ref("/userPictures").on("child_added", function(snapshot) {

        userPictureBase64 = snapshot.val().UserPicture;
        timeAdded = snapshot.val().dateAdded;

        $("#pastResults").append("Past Picture: " + `<img id='FirebasePicture' src='${userPictureBase64}' width='50%'> <br>`);
        $("#pastResults").append("Date Added: " + timeAdded + "<br>");
    })
});