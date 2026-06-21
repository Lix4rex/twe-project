var jFriendItem = $("<div>")
    .addClass("friend-item")
    .append($("<span>").addClass("friend-username"))
    .append($("<span>").addClass("friend-fullname"))
    .append($("<button>").addClass("btn-remove-friend").html("Retirer"));

var jRequestItem = $("<div>")
    .addClass("request-item")
    .append($("<span>").addClass("request-username"))
    .append($("<span>").addClass("request-fullname"))
    .append($("<button>").addClass("btn-accept-request").html("Accepter"))
    .append($("<button>").addClass("btn-reject-request").html("Rejeter"));

var jSentItem = $("<div>")
    .addClass("sent-item")
    .append($("<span>").addClass("sent-username"))
    .append($("<span>").addClass("sent-fullname"))
    .append($("<button>").addClass("btn-cancel-request").html("Annuler"));


function sendFriendRequest(username){
    var msgEl = $("#add-friend-message");
    msgEl.html("").removeClass("error success");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "send_friend_request", "friend_username": username},
        dataType: "json",
        success: function(oRep){
            if (oRep.success){
                msgEl.addClass("success").html("Demande envoyée !");
                $("#friend-username-input").val("");
                display_sent_requests();
            } else {
                msgEl.addClass("error").html(oRep.error || "Une erreur est survenue");
            }
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
            msgEl.addClass("error").html("Une erreur est survenue");
        },
    });
}

function acceptFriendRequest(id_friendship){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "accept_friend_request", "id_friendship": id_friendship},
        dataType: "json",
        success: function(oRep){
            display_friend_requests();
            display_friends();
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function rejectFriendRequest(id_friendship, callback){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "reject_friend_request", "id_friendship": id_friendship},
        dataType: "json",
        success: function(oRep){
            if (callback) callback();
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function removeFriend(friend_id_user){
    if (!confirm("Voulez-vous vraiment retirer cet ami ?")) return;

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "remove_friend", "friend_id_user": friend_id_user},
        dataType: "json",
        success: function(oRep){
            display_friends();
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function display_friends(){
    var listDiv = $("#friends-list");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "get_friends"},
        dataType: "json",
        success: function(oRep){
            listDiv.empty();

            if (!oRep.length){
                listDiv.append($("<p>").addClass("empty-msg").html("Vous n'avez pas encore d'ami."));
                return;
            }

            oRep.forEach(function(friend){
                var jClone = jFriendItem.clone(true);
                jClone.find(".friend-username").html(friend.username);
                jClone.find(".friend-fullname").html(friend.first_name + " " + friend.last_name);
                jClone.find(".btn-remove-friend").click(function(){
                    removeFriend(friend.id);
                });
                listDiv.append(jClone);
            });
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function display_friend_requests(){
    var listDiv = $("#friend-requests-list");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "get_pending_friend_requests"},
        dataType: "json",
        success: function(oRep){
            listDiv.empty();

            if (!oRep.length){
                listDiv.append($("<p>").addClass("empty-msg").html("Aucune demande en attente."));
                return;
            }

            oRep.forEach(function(req){
                var jClone = jRequestItem.clone(true);
                jClone.find(".request-username").html(req.username);
                jClone.find(".request-fullname").html(req.first_name + " " + req.last_name);
                jClone.find(".btn-accept-request").click(function(){
                    acceptFriendRequest(req.friendship_id);
                });
                jClone.find(".btn-reject-request").click(function(){
                    rejectFriendRequest(req.friendship_id, display_friend_requests);
                });
                listDiv.append(jClone);
            });
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

function display_sent_requests(){
    var listDiv = $("#sent-requests-list");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "get_sent_friend_requests"},
        dataType: "json",
        success: function(oRep){
            listDiv.empty();

            if (!oRep.length){
                listDiv.append($("<p>").addClass("empty-msg").html("Aucune demande envoyée."));
                return;
            }

            oRep.forEach(function(req){
                var jClone = jSentItem.clone(true);
                jClone.find(".sent-username").html(req.username);
                jClone.find(".sent-fullname").html(req.first_name + " " + req.last_name);
                jClone.find(".btn-cancel-request").click(function(){
                    rejectFriendRequest(req.friendship_id, display_sent_requests);
                });
                listDiv.append(jClone);
            });
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },
    });
}

$(document).ready(function(){
    display_friends();
    display_friend_requests();
    display_sent_requests();

    $("#add-friend-btn").click(function(){
        var username = $("#friend-username-input").val().trim();
        if (!username){
            $("#add-friend-message").addClass("error").html("Veuillez entrer un nom d'utilisateur");
            return;
        }
        sendFriendRequest(username);
    });

    $("#friend-username-input").keypress(function(e){
        if (e.which == 13){
            $("#add-friend-btn").click();
        }
    });
});
