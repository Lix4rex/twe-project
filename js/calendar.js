
var jFriendItem = $("<div>")
    .addClass("calendar-friend-item")
    .append($("<span>").addClass("calendar-friend-username"))
    .append($("<span>").addClass("calendar-friend-fullname"));




function getMonday(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = (day === 0) ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

var currentMonday = getMonday(new Date());
var currentFriendId = null;



function createCalendar(monday) {
    // Conteneur général
    var jCalendar = $("<div>").addClass("calendar-container");

    let sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // 1. Le titre de la semaine vient en premier tout en haut
    jCalendar.append(
        $("<h2>")
            .addClass("calendar-week-title")
            .text(
                "Semaine du " +
                monday.toLocaleDateString("fr-FR") +
                " au " +
                sunday.toLocaleDateString("fr-FR")
            )
    );

    // 2. On crée une div dédiée qui va contenir uniquement la grille des 7 jours
    var jGrid = $("<div>").addClass("calendar-grid");

    for (let i = 0; i < 7; i++) {
        let current = new Date(monday);
        current.setDate(monday.getDate() + i);

        let dateStr = formatDate(current);

        jGrid.append(
            $("<div>")
                .addClass("calendar-day")
                .attr("data-date", dateStr)
                .append(
                    $("<div>")
                        .addClass("calendar-day-title")
                        .text(
                            current.toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "numeric"
                            })
                        )
                )
        );
    }

    // On ajoute la grille sous le titre
    jCalendar.append(jGrid);

    return jCalendar;
}




var jPreviousWeekBtn = $("<input type='button'>")
    .attr("id", "previous-week")
    .val("Semaine précédente")
    .click(function () {
        currentMonday.setDate(currentMonday.getDate() - 7);
        reload_calendar();
    });

var jNextWeekBtn = $("<input type='button'>")
    .attr("id", "next-week")
    .val("Semaine suivante")
    .click(function () {
        currentMonday.setDate(currentMonday.getDate() + 7);
        reload_calendar();
    });


function reload_calendar() {
    if (currentFriendId) {
        display_friend_calendar(currentFriendId, currentMonday);
    }
}




function display_friends() {

    var listDiv = $("#friend-box");

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: { action: "get_friends" },
        dataType: "json",
        success: function(oRep) {

            listDiv.empty();

            if (!oRep.length) {
                listDiv.append(
                    $("<p>")
                        .addClass("empty-msg")
                        .html("Vous n'avez pas encore d'ami.")
                );
                return;
            }

            oRep.forEach(function(friend) {

                var jClone = jFriendItem.clone(true);

                jClone.find(".calendar-friend-username")
                    .html(friend.username);

                jClone.find(".calendar-friend-fullname")
                    .html(friend.first_name + " " + friend.last_name);

                jClone.click(function() {
                    display_friend_calendar(friend.id, currentMonday);
                });

                listDiv.append(jClone);
            });
        },
        error: function(xhr, status, error) {
            console.log("ERROR: ", error);
        }
    });
}



function display_friend_calendar(friendId, monday = currentMonday) {

    currentFriendId = friendId;

    var calendar_div = $("#calendar-box");
    calendar_div.empty();

    /* CONTROLS */
    var controls = $("<div>")
        .addClass("calendar-controls")
        .append(jPreviousWeekBtn.clone(true))
        .append(jNextWeekBtn.clone(true));

    calendar_div.append(controls);

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {
            action: "get_user_calendar",
            id_user: friendId,
            date: formatDate(monday)
        },
        dataType: "json",
        success: function(oRep) {

            var jCloneCalendar = createCalendar(monday);

            oRep.forEach(function(event) {

                var dayDiv = jCloneCalendar.find(
                    ".calendar-day[data-date='" + event.date_event + "']"
                );

                if (!dayDiv.length) return;

                dayDiv.append(
                    $("<div>")
                        .addClass("calendar-event")
                        .data("event_id", event.id)
                        .append(
                            $("<div>")
                                .addClass("calendar-event-title")
                                .text(event.titre)
                        )
                        .append(
                            $("<div>")
                                .addClass("calendar-event-time")
                                .text(
                                    event.heure_debut.substring(0,5) +
                                    " - " +
                                    event.heure_fin.substring(0,5)
                                )
                        )
                        .append(
                            $("<div>")
                                .addClass("calendar-event-description")
                                .text(event.description || "")
                        )
                );
            });

            calendar_div.append(jCloneCalendar);
        },
        error: function(xhr, status, error) {
            console.log("ERROR: ", error);
        }
    });
}




$(document).ready(function() {
    display_friends();
});