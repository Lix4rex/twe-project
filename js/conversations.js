
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

function betEmotion(friend_id_user, emotion){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "send_day_bet", "friend_id_user": friend_id_user, "emotion": emotion},
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
                    if ($(this).val() == "Parier pour demain") betEmotion(friend_id_user, selectedEmotion);
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