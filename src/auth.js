

var phoneNum = 1234567890
var user = {};


var db = firebase.firestore();

window.onload = (event) => {
	$("#canvasDiv").hide();
	checkLogin();
};

function checkLogin(){
	user_store = localStorage.getItem('user');
	if (user_store) {
		user = JSON.parse(user_store);
		if (user["id"] === "not_in_program") {
			$("#message").html("Join Program");
		    $("#submessage").html("You are currently not in the MonitorPD program, click below to join:");
		    $("#phoneDiv").hide();
		    $("#startDiv").hide();
		    var canvasDiv = document.getElementById('canvasDiv');
		    joinProgram = document.createElement('button');
			joinProgram.className = "btn btn-primary btn-lg";
			joinProgram.setAttribute('onclick', "joinProgramClick()");
			joinProgram.innerHTML = "Join Program";
			canvasDiv.appendChild(joinProgram);
			$("#canvasDiv").show();
			localStorage.removeItem('user');
		} else {
			$("#message").html("Welcome back, " + user["firstname"]);
			$("#phoneDiv").hide();
			$("#startDiv").show();
		}
	} else {
		$("#phoneDiv").show();
		$("#startDiv").hide();
	}
}

//This function runs everytime the auth state changes. Use to verify if the user is logged in
firebase.auth().onAuthStateChanged(function(auth_user) {
	if (auth_user) {
	  user_store = localStorage.getItem('user');
	  if (user_store){
	  	 if (JSON.parse(user_store)["id"] !== "not_in_program"){
	  	 	console.log("already logged in");
	  	 } else {
	  	 	login(auth_user.phoneNumber);
	  	 }
	  } else {
	  	login(auth_user.phoneNumber)
	  }
	  
	} else {
	  // No user is signed in.
	  console.log("USER NOT LOGGED IN");
	}
});

function login(phoneNumber) {

	console.log(phoneNumber);
	user = {};

	db.collectionGroup('patients')
	  .where('phone', '==', phoneNumber.substr(2))
	  .get().then((querySnapshot) => {
	    querySnapshot.forEach((doc) => {
	        //console.log(`${doc.id} => ${doc.data()}`);
	        console.log("found");
	        user["id"] = doc.id;
	        user["firstname"] = doc.data()["firstname"];
	        user["lastname"] = doc.data()["lastname"];
	        user["phone"] = doc.data()["phone"];
	        user["doctor"] = doc.data()["doctor_id"];
	        localStorage.setItem('user', JSON.stringify(user));
	        checkLogin();
	    });
	});

	console.log("reached");

	user["id"] = "not_in_program";
	localStorage.setItem('user', JSON.stringify(user));
}


function joinProgramClick() {
	window.location.replace("./index.html#program");
}


