
var jGroupDiv = $("<div>")
    .addClass("group")
    .append($("<p>").addClass("group-name"));

var jInfoUserDiv = $("<div>")
    .addClass("info-user")
    .append($("<p>").addClass("username"))
    .append($("<p>").addClass("firstname"))
    .append($("<p>").addClass("lastname"));

const emotions = [
    "heureux",
    "triste",
    "stressé",
    "fatigué",
    "colère",
];

var jEmotionCb = $("<div>")
    .addClass("emotion-cb")
    .append($("<input type='radio' name='emotion'>"))
    .append($("<p>"))
    .click(function () {
        $(this).find("input[type='radio']").prop("checked", true);
    });

var jUserDiv = $("<div>")
    .addClass("user")
    .append(jInfoUserDiv.clone(true))
    .click(function(){
        display_betting_panel($(this).data("friend_id_user"), $(this).find(".username").html(), $(this).find(".firstname").html(), $(this).find(".lastname").html());
    });

var jMessageDiv = $("<div>")
    .addClass("message")
    .append($("<p>").addClass("date"))
    .append($("<p>").addClass("message-sender"))
    .append($("<p>").addClass("content"));



function sendMessage(id_group, message){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "send_message", "id_group": id_group, "message": message},
        dataType: "json",
        success: function(oRep){
            display_messages(id_group);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

function betEmotion(friend_id_user, emotion, id_group){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "send_day_bet", "friend_id_user": friend_id_user, "emotion": emotion, "id_group": id_group},
        dataType: "json",
        success: function(oRep){
            console.log(oRep);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

function updateEmotion(friend_id_user, emotion){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "update_day_bet", "friend_id_user": friend_id_user, "emotion": emotion},
        dataType: "json",
        success: function(oRep){
            console.log(oRep);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

async function display_bet(friend_id_user){

    var oRep = await $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_tommorow_bet", "friend_id_user": friend_id_user},
        dataType: "json",
        success: function(oRep){
            return oRep
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });

    if (oRep.id_user == friend_id_user) return {"is_bet": false, "himself": true};

    if (!oRep[0]){
        $(".conversation-users").append(
            $("<div>")
                .addClass("pari-description")
                .append($("<p>").html("Pas de pari pour le " + oRep.next_day))
        );
        return {"is_bet": false, "himself": false};
    } else {
        var pari = oRep[0];
        
        $(".conversation-users").append(
            $("<div>")
                .addClass("pari-description")
                .append($("<p>").html("Pari du " + pari.date_pari + " : " + pari.emotion))
        );

        return {"is_bet": true, "himself": false};
    }
}

function display_previous_result(friend_id_user){

    var conversation_users_div = $(".conversation-users");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_previous_emotions", "friend_id_user": friend_id_user},
        dataType: "json",
        success: function(oRep){
            var container = $("<div>").addClass("previous-emotions");

            var tableHtml = `
                <table class="table-previous-emotions">
                    <thead>
                        <tr>
                            <th>Jour</th>
                            <th>Émotion</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            const emotionsByDate = {};

            oRep.forEach(function(emotion){
                emotionsByDate[emotion.date_emotion] = emotion.emotion;
            });

            for(var i = 6; i >= 0; i--){

                const date = new Date();
                date.setDate(date.getDate() - i);

                const dateStr = date.toISOString().split('T')[0];

                tableHtml += `
                    <tr>
                        <td>${dateStr}</td>
                        <td>${emotionsByDate[dateStr] || 'X'}</td>
                    </tr>
                `;
            }

            tableHtml += `
                    </tbody>
                </table>
            `;

            container.append(tableHtml);

            $(".conversation-users").append(container);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });

}

function display_betting_panel(friend_id_user, username, firstname, lastname){

    var conversation_users_div = $(".conversation-users"); 
    var id_group = conversation_users_div.data("id_group");

    var jCloneInfoUser = jInfoUserDiv.clone(true);
    jCloneInfoUser.find(".username").html(username);
    jCloneInfoUser.find(".firstname").html(firstname);
    jCloneInfoUser.find(".lastname").html(lastname);

    conversation_users_div.empty();
    
    conversation_users_div.data("id_group", id_group);

    conversation_users_div.append(
        $("<input type='submit'>")
            .val("Retour")
            .data("friend_id_user", friend_id_user)
            .click(function(){
                conversation_users_div.empty();
                display_group_users(id_group);
            })
    );
    conversation_users_div.append(jCloneInfoUser);


    var emotionsDiv = $("<div>")
        .addClass("emotions");
    emotions.forEach(function(emotion){
        var jCloneEmotionCb = jEmotionCb.clone(true);
        jCloneEmotionCb.find("input").val(emotion);
        jCloneEmotionCb.find("p").html(emotion);
        emotionsDiv.append(jCloneEmotionCb);
    });
    
    var bet_val_btn = "Parier pour demain";
    display_bet(friend_id_user).then(function(result){
        
        var is_bet = result.is_bet;
        if (is_bet) bet_val_btn = "Changer son pari pour demain";
        
        if (!result.himself){
            conversation_users_div.append(emotionsDiv);
            conversation_users_div.append(
                $("<input type='submit'>")
                .val(bet_val_btn)
                .click(function(){
                    var selectedEmotion = $("input[name='emotion']:checked").val();
                    if (!selectedEmotion){
                        alert("Il faut choisir une émotion pour parier")
                        return;
                    }
                    if ($(this).val() == "Parier pour demain") betEmotion(friend_id_user, selectedEmotion, id_group);
                    else updateEmotion(friend_id_user, selectedEmotion);

                    display_betting_panel(friend_id_user, username, firstname, lastname);
                })
            );
            conversation_users_div.append($("<p>").html("Voici les émotions des 7 derniers jours"));
        } else {
            conversation_users_div.append($("<p>").html("Voici vos émotions des 7 derniers jours"));
        }
        display_previous_result(friend_id_user);
    });
}

function leaveGroup(id_group){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "leave_group", "id_group": id_group},
        dataType: "json",
        success: function(oRep){
            $("#conversation").empty();
            display_groups();
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function display_groups(){
    const groups_div = $("#groups-list");
    groups_div.empty();

    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_groups"},
        dataType: "json",
        success: function(oRep){
            for (var group of oRep){
                var jCloneGroupDiv = jGroupDiv.clone(true);
                jCloneGroupDiv.find(".group-name").html(group.name);
                jCloneGroupDiv.data("id", group.id);
                groups_div.append(jCloneGroupDiv);
            }
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

async function display_messages(id_group){
    const conversations_div = $("#conversation");

    conversations_div.find(".messages").empty();

    const oRepConversation = await $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "get_conversation", "id_group": id_group},
        dataType: "json",
        success: function(oRep){
            return oRep;
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });

    for (var message of oRepConversation){


        const oRepUser = await $.ajax({
            type: "GET",
            url: "controleur.php",
            data: {"action": "get_user", "id_user": message.user_id},
            dataType: "json",
            success: function(oRep){
                return oRep;
            },
            error: function(xhr, status, error){
                console.log("ERROR: ", error);
            },
        });
        var user = oRepUser[0];

        var jCloneMessageDiv = jMessageDiv.clone(true);
        jCloneMessageDiv.find(".date").html(message.created_at);
        jCloneMessageDiv.find(".message-sender").html("(" + user.username + ")");
        jCloneMessageDiv.find(".content").html(message.content);

        if (user.id == oRepUser.connected_user_id){
            jCloneMessageDiv.addClass("sent-message");
        } else {
            jCloneMessageDiv.addClass("recieved-message");
        }

        conversations_div.find(".messages").append(jCloneMessageDiv);
    }
}

async function display_group_users(id_group){

    const group_users = await $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_group_users", "id_group": id_group},
        dataType: "json",
        success: function(oRep){
            return oRep;
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });

    for (var group_user of group_users){

        const oRepUser = await $.ajax({
            type: "GET",
            url: "controleur.php",
            //headers: {"debug-data":true},
            data: {"action": "get_user", "id_user": group_user.user_id},
            dataType: "json",
            success: function(oRep){
                return oRep;
            },
            error: function(xhr, status, error){
                console.log("ERROR: ", error);
            },
        });

        const user = oRepUser[0];
        var jCloneUserDiv = jUserDiv.clone(true);
        jCloneUserDiv.find(".firstname").html(user.first_name);
        jCloneUserDiv.find(".lastname").html(user.last_name);
        jCloneUserDiv.find(".username").html(user.username);
        jCloneUserDiv.data("friend_id_user", group_user.user_id);

        // Bouton "Info météo" : ouvre la corrélation humeur / météo de cet ami.
        // stopPropagation évite de déclencher le clic du .user (panneau de pari).
        var jInfoMeteoBtn = $("<input type='button'>")
            .addClass("info-meteo-btn")
            .val("Info météo")
            .click(function(e){
                e.stopPropagation();
                var userDiv = $(this).closest(".user");
                var fid = userDiv.data("friend_id_user");
                var nom = userDiv.find(".firstname").html() + " " + userDiv.find(".lastname").html();
                display_weather_correlation(fid, nom);
            });
        jCloneUserDiv.append(jInfoMeteoBtn);

        $(".conversation-users").data("id_group", id_group);
        $(".conversation-users").append(jCloneUserDiv);
    }
}

async function display_conversation(id_group){
    const conversations_div = $("#conversation");

    conversations_div.empty();

    const oRepGroup = await $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "get_group", "id_group": id_group},
        dataType: "json",
        success: function(oRep){
            return oRep;
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
    const group = oRepGroup[0];

    conversations_div.append(
        $("<div>")
            .addClass("conversation-title")
            .append($("<p>").html("Conversation du groupe " + group.name))
            .append(
                $("<input type='button'>")
                    .addClass("leave-group-btn")
                    .val("Quitter le groupe")
                    .click(function(){
                        if (confirm("Voulez-vous vraiment quitter le groupe " + group.name + " ?")){
                            leaveGroup(id_group);
                        }
                    })
            )
    );

    conversations_div.append(
        $("<div>")
            .addClass("conversation-body")
            .append(
                $("<div>").addClass("messages")
            )
            .append(
                $("<div>").addClass("conversation-users")
            )
    );

    display_messages(id_group);
    display_group_users(id_group);
    
    conversations_div.append(
        $("<div>")
            .addClass("send-div")
            .append($("<textarea>"))
            .append(
                $("<input type='button'>")
                    .val("Envoyer")
                    .click(function() {
                        var message = $(this).prev().val()
                        sendMessage(id_group, message);
                    })
            )
    );
}


$(document).on("click", ".group", function () {
    var id_group = $(this).data("id");
    display_conversation(id_group);
});

function display_friends_checklist(){
    var checklistDiv = $("#friends-checklist");
    checklistDiv.empty();

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "get_friends"},
        dataType: "json",
        success: function(oRep){
            oRep.forEach(function(friend){
                checklistDiv.append(
                    $("<label>")
                        .addClass("friend-checkbox")
                        .append($("<input type='checkbox'>").val(friend.id))
                        .append($("<span>").html(friend.username))
                );
            });
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function createGroup(name, friend_ids){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "create_group", "group_name": name, "friend_ids": friend_ids.join(",")},
        dataType: "json",
        success: function(oRep){
            if (oRep.success){
                $("#new-group-name").val("");
                $("#create-group-form input[type='checkbox']").prop("checked", false);
                $("#create-group-form").hide();
                $("#create-group-message").html("");
                display_groups();
            } else {
                $("#create-group-message").html(oRep.error);
            }
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

$(document).on("click", "#show-create-group-btn", function(){
    $("#create-group-form").toggle();
    display_friends_checklist();
});

$(document).on("click", "#confirm-create-group-btn", function(){
    var name = $("#new-group-name").val();
    if (!name){
        $("#create-group-message").html("Il faut donner un nom au groupe");
        return;
    }

    var friend_ids = [];
    $("#friends-checklist input[type='checkbox']:checked").each(function(){
        friend_ids.push($(this).val());
    });

    createGroup(name, friend_ids);
});

$(document).ready(function(){
    display_groups();
});









// Ville de référence pour la météo (modifiable via le champ dédié). Au départ : Lille.
var meteoRefLat = 50.63;
var meteoRefLon = 3.06;
var meteoRefNom = "Lille";

// On garde l'ami courant pour pouvoir recalculer si on change la ville
var correlationFriendId = null;
var correlationFriendNom = "";

// Échelle ordonnée des 5 humeurs, de la "moins bonne" (0) à la "meilleure" (4).
// L'indice d'humeur = la position dans ce tableau (sert d'axe pour les graphiques).
const echelleHumeur = ["colère", "triste", "stressé", "fatigué", "heureux"];

function indiceHumeur(emotion){
    var i = echelleHumeur.indexOf(emotion);
    return (i === -1) ? null : i;
}

// Renvoie le nom de l'humeur pour une valeur d'axe (entier), sinon chaîne vide
function humeurDepuisIndice(valeur){
    return (valeur === Math.round(valeur) && echelleHumeur[valeur] !== undefined)
        ? echelleHumeur[valeur] : "";
}

// Traduit un code météo WMO (Open-Meteo) en description française
function codeMeteoFr(code){
    var m = {
        0: "Ciel dégagé", 1: "Plutôt dégagé", 2: "Partiellement nuageux", 3: "Couvert",
        45: "Brouillard", 48: "Brouillard givrant",
        51: "Bruine légère", 53: "Bruine", 55: "Bruine dense",
        56: "Bruine verglaçante", 57: "Bruine verglaçante",
        61: "Pluie faible", 63: "Pluie", 65: "Pluie forte",
        66: "Pluie verglaçante", 67: "Pluie verglaçante",
        71: "Neige faible", 73: "Neige", 75: "Neige forte", 77: "Grains de neige",
        80: "Averses faibles", 81: "Averses", 82: "Averses violentes",
        85: "Averses de neige", 86: "Averses de neige",
        95: "Orage", 96: "Orage avec grêle", 99: "Orage avec grêle"
    };
    return m[code] || ("Code " + code);
}

// Coefficient de corrélation de Pearson entre deux séries de même longueur
function pearson(x, y){
    var n = x.length;
    if (n < 2) return null;
    var sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
    for (var i = 0; i < n; i++){
        sx += x[i]; sy += y[i]; sxy += x[i] * y[i];
        sx2 += x[i] * x[i]; sy2 += y[i] * y[i];
    }
    var num = n * sxy - sx * sy;
    var den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
    if (den === 0) return null; // pas de variance -> corrélation indéfinie
    return num / den;
}

// Interprétation lisible d'un coefficient de corrélation
function interpretationR(r){
    if (r === null) return "données insuffisantes";
    var a = Math.abs(r);
    var force = a < 0.2 ? "très faible" : a < 0.4 ? "faible" : a < 0.6 ? "modérée" : a < 0.8 ? "forte" : "très forte";
    var sens = r > 0 ? "positive" : "négative";
    return "corrélation " + force + " " + sens + " (r = " + r.toFixed(2) + ")";
}

// On garde une référence aux graphiques pour les détruire avant d'en recréer
var correlationCharts = [];

function detruireGraphsCorrelation(){
    correlationCharts.forEach(function(c){ c.destroy(); });
    correlationCharts = [];
}

// Affiche le panneau de corrélation pour un ami donné
function display_weather_correlation(friend_id_user, nom){
    var box = $(".conversation-users");
    var id_group = box.data("id_group");

    // On mémorise l'ami courant (pour recalculer si on change la ville)
    correlationFriendId = friend_id_user;
    correlationFriendNom = nom;

    detruireGraphsCorrelation();
    box.empty();
    box.data("id_group", id_group);

    box.append(
        $("<input type='submit'>")
            .val("Retour")
            .click(function(){
                detruireGraphsCorrelation();
                box.empty();
                display_group_users(id_group);
            })
    );

    box.append($("<h3>").html("Corrélation humeur / météo - " + nom));

    // Champ pour changer la ville de référence
    var villeControls = $("<div>").addClass("correlation-city-controls");
    villeControls.append($("<label>").html("Ville de référence : "));
    var cityInput = $("<input type='text'>")
        .attr("id", "correlation-city-input")
        .attr("placeholder", "Nom d'une ville")
        .val(meteoRefNom);
    var cityBtn = $("<input type='button'>")
        .addClass("correlation-city-btn")
        .val("Changer la ville")
        .click(function(){
            var ville = $("#correlation-city-input").val().trim();
            if (!ville){ return; }
            changerVilleReference(ville);
        });
    villeControls.append(cityInput).append(cityBtn);
    box.append(villeControls);

    box.append($("<p>").addClass("correlation-note").html(
        "Comment lire : le coefficient (r) va de -1 à +1. Proche de <b>+1</b>, l'humeur s'améliore quand la valeur météo augmente ; " +
        "proche de <b>-1</b>, l'humeur se dégrade quand elle augmente ; proche de <b>0</b>, il n'y a pas de lien net."
    ));

    var panel = $("<div>").attr("id", "correlation-panel").html("<p>Chargement…</p>");
    box.append(panel);

    // 1) Humeurs passées de l'ami (action déjà existante)
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "get_previous_emotions", "friend_id_user": friend_id_user},
        dataType: "json",
        success: function(emotions){
            var emoByDate = {};
            (emotions || []).forEach(function(e){ emoByDate[e.date_emotion] = e.emotion; });

            // 2) Météo passée de la ville de référence (Open-Meteo, sur 30 jours)
            var url = "https://api.open-meteo.com/v1/forecast?latitude=" + meteoRefLat + "&longitude=" + meteoRefLon
                    + "&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum"
                    + "&past_days=30&forecast_days=1&timezone=auto";

            fetch(url)
                .then(function(r){ return r.json(); })
                .then(function(d){ construireCorrelation(panel, emoByDate, d); })
                .catch(function(err){
                    panel.html("<p class='correlation-note'>Impossible de récupérer la météo.</p>");
                    console.log("ERROR meteo: ", err);
                });
        },
        error: function(xhr, status, error){
            panel.html("<p class='correlation-note'>Impossible de récupérer les humeurs.</p>");
            console.log("ERROR: ", error);
        },
    });
}

// Change la ville de référence : on géocode le nom (API gratuite Open-Meteo, sans clé)
// puis on relance le calcul de corrélation pour l'ami courant.
function changerVilleReference(ville){
    var url = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(ville)
            + "&count=1&language=fr&format=json";

    fetch(url)
        .then(function(r){ return r.json(); })
        .then(function(data){
            if (!data.results || !data.results.length){
                alert("Ville introuvable : " + ville);
                return;
            }
            var lieu = data.results[0];
            meteoRefLat = lieu.latitude;
            meteoRefLon = lieu.longitude;
            meteoRefNom = lieu.name + (lieu.country ? " (" + lieu.country + ")" : "");
            // On recalcule la corrélation pour l'ami courant avec la nouvelle ville
            display_weather_correlation(correlationFriendId, correlationFriendNom);
        })
        .catch(function(err){
            alert("Erreur lors de la recherche de la ville.");
            console.log("ERROR geocoding: ", err);
        });
}

// Construit le tableau des corrélations + les graphiques à partir des données jointes par date
function construireCorrelation(panel, emoByDate, d){
    detruireGraphsCorrelation();
    panel.empty();

    if (!d.daily || !d.daily.time){
        panel.html("<p class='correlation-note'>Données météo indisponibles.</p>");
        return;
    }

    var t = d.daily.time;
    var mood = [], tmax = [], tmin = [], precip = [], wind = [], condLabels = [];

    // Jointure par date : on ne garde que les jours où l'ami a une humeur enregistrée
    for (var i = 0; i < t.length; i++){
        var emo = emoByDate[t[i]];
        if (emo === undefined) continue;
        var mi = indiceHumeur(emo);
        if (mi === null) continue;
        mood.push(mi);
        tmax.push(d.daily.temperature_2m_max[i]);
        tmin.push(d.daily.temperature_2m_min[i]);
        precip.push(d.daily.precipitation_sum[i]);
        wind.push(d.daily.wind_speed_10m_max[i]);
        condLabels.push(codeMeteoFr(d.daily.weather_code[i]));
    }

    if (mood.length < 2){
        panel.html("<p class='correlation-note'>Pas assez de jours communs entre les humeurs de cet ami et la météo " +
                   "pour calculer une corrélation. Reviens quand il y aura plus d'historique d'humeurs.</p>");
        return;
    }

    var variables = [
        ["Température max", tmax],
        ["Température min", tmin],
        ["Précipitations", precip],
        ["Vent max", wind]
    ];

    // 1) Tableau récapitulatif des coefficients de corrélation
    panel.append($("<h4>").html("Coefficients de corrélation (" + mood.length + " jours)"));
    var table = $("<table>").addClass("correlation-table");
    table.append(
        $("<tr>")
            .append($("<th>").html("Variable météo"))
            .append($("<th>").html("Lien avec l'humeur"))
    );
    variables.forEach(function(v){
        var r = pearson(v[1], mood);
        table.append(
            $("<tr>")
                .append($("<td>").html(v[0]))
                .append($("<td>").html(interpretationR(r)))
        );
    });
    panel.append(table);

    // 2) Nuages de points : humeur (Y) en fonction de chaque variable météo (X)
    var grid = $("<div>").addClass("correlation-grid");
    panel.append(grid);

    variables.forEach(function(v){
        var wrap = $("<div>").addClass("correlation-chart");
        wrap.append($("<p>").addClass("chart-title").html("Humeur vs " + v[0]));
        var canvas = $("<canvas>");
        wrap.append(canvas);
        grid.append(wrap);

        var pts = v[1].map(function(val, idx){ return {x: val, y: mood[idx]}; });
        var c = new Chart(canvas[0].getContext("2d"), {
            type: "scatter",
            data: { datasets: [{ label: "Jours", data: pts, backgroundColor: "#2980b9" }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: v[0] } },
                    y: {
                        title: { display: true, text: "Humeur" },
                        min: -0.5, max: echelleHumeur.length - 0.5,
                        afterBuildTicks: function(axis){
                            axis.ticks = echelleHumeur.map(function(_, i){ return { value: i }; });
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function(value){ return humeurDepuisIndice(value); }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: {
                        label: function(ctx){
                            return humeurDepuisIndice(ctx.parsed.y) + " (" + v[0].toLowerCase() + " : " + ctx.parsed.x + ")";
                        }
                    } }
                }
            }
        });
        correlationCharts.push(c);
    });

    // 3) Condition météo : humeur moyenne par type de condition
    var byCond = {};
    condLabels.forEach(function(c, idx){
        if (!byCond[c]) byCond[c] = [];
        byCond[c].push(mood[idx]);
    });
    var condNames = Object.keys(byCond);
    var condMeans = condNames.map(function(c){
        var arr = byCond[c];
        return arr.reduce(function(a, b){ return a + b; }, 0) / arr.length;
    });

    var wrapC = $("<div>").addClass("correlation-chart");
    wrapC.append($("<p>").addClass("chart-title").html("Humeur moyenne par condition"));
    var canvasC = $("<canvas>");
    wrapC.append(canvasC);
    grid.append(wrapC);

    var cc = new Chart(canvasC[0].getContext("2d"), {
        type: "bar",
        data: { labels: condNames, datasets: [{ label: "Humeur moyenne", data: condMeans, backgroundColor: "#27ae60" }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: {
                min: 0, max: echelleHumeur.length - 1,
                title: { display: true, text: "Humeur moyenne" },
                afterBuildTicks: function(axis){
                    axis.ticks = echelleHumeur.map(function(_, i){ return { value: i }; });
                },
                ticks: {
                    stepSize: 1,
                    callback: function(value){ return humeurDepuisIndice(value); }
                }
            } }
        }
    });
    correlationCharts.push(cc);
}