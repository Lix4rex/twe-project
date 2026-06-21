
var jInfoUserDiv = $("<div>")
    .addClass("info-user")
    .append($("<p>").addClass("username"))
    .append($("<p>").addClass("firstname"))
    .append($("<p>").addClass("lastname"));

var jEmotionCb = $("<div>")
    .addClass("emotion-cb-user")
    .append($("<input type='radio' name='emotion_user'>"))
    .append($("<p>"))
    .click(function () {
        $(this).find("input[type='radio']").prop("checked", true);
    });

const emotions = [
    "heureux",
    "triste",
    "stressé",
    "fatigué",
    "colère",
];
//-----------------------amis----------------------------------
function chargerLeaderboard(idGroup){  //ce que j'ai ajouté la, a verifier

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			document.getElementById("leaderboard").innerHTML =
				xhr.responseText;
		}
	};

	xhr.open("GET", "ajax_leaderboard.php?groupe=" + idGroup, true);
	xhr.send();
}

document.getElementById("rechercheUser").addEventListener("keyup", function(){

	let texte = this.value;

	if(texte.length < 3){
		document.getElementById("resultatsRecherche").innerHTML = "";
		return;
	}

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){

		if(xhr.readyState == 4 && xhr.status == 200){

			document.getElementById("resultatsRecherche").innerHTML =
				xhr.responseText;
		}
	};

	xhr.open(
		"GET",
		"ajax_recherche_user.php?search="+encodeURIComponent(texte),
		true
	);

	xhr.send();
});


function rechercherUtilisateur(){

	let texte = document.getElementById("rechercheUser").value;

	if(texte.length < 3){

		document.getElementById(
			"resultatsRecherche"
		).innerHTML = "";

		return;
	}

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){

		if(xhr.readyState == 4 && xhr.status == 200){

			document.getElementById(
				"resultatsRecherche"
			).innerHTML = xhr.responseText;
		}
	};

	xhr.open(
		"GET",
		"ajax_recherche_user.php?search="
		+ encodeURIComponent(texte),
		true
	);

	xhr.send();
}

//-------------------------------------------------------------

function setDayEmotion(emotion){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "set_day_emotion", "emotion": emotion},
        dataType: "json",
        success: function(oRep){
            display_mood();
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

function display_profile(){
    var profile_div = $("div[id='profile']");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_user"},
        dataType: "json",
        success: function(oRep){
            var user = oRep[0];
            var jCloneInfoUser = jInfoUserDiv.clone(true);
            jCloneInfoUser.find(".username").html(user.username);
            jCloneInfoUser.find(".firstname").html(user.first_name);
            jCloneInfoUser.find(".lastname").html(user.last_name);
            profile_div.append(jCloneInfoUser);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

async function display_mood(){
    var mood_div = $("div[id='personal-feeling']");

    mood_div.empty();

    var today = new Date();
    var dateString = today.toLocaleDateString('fr-FR');
    mood_div.append($("<p>").html("Humeur du jour (" + dateString + ")"));

    var oRepDayEmotion = await $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_day_emotion"},
        dataType: "json",
        success: function(oRep){
            return oRep;
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });

    console.log(oRepDayEmotion);

    if (oRepDayEmotion.length) {
        var emotion = oRepDayEmotion[0];
        mood_div.append($("<p>").html(emotion.emotion));
    } else {

        var emotionsDiv = $("<div>")
            .addClass("emotions");
        emotions.forEach(function(emotion){
            var jCloneEmotionCb = jEmotionCb.clone(true);
            jCloneEmotionCb.find("input").val(emotion);
            jCloneEmotionCb.find("p").html(emotion);
            emotionsDiv.append(jCloneEmotionCb);
        });
        mood_div.append(emotionsDiv);

        mood_div.append(
            $("<input type='submit'>")
                .val("Remplir l'humeur du jour")
                .click(function(){
                    var selectedEmotion = $("input[name='emotion_user']:checked").val();
                    if (!selectedEmotion){
                        alert("Il faut choisir une émotion")
                        return;
                    }
                    setDayEmotion(selectedEmotion);
                })
        );
    }
}

$(document).ready(function(){
    display_profile();
    display_mood();
});
