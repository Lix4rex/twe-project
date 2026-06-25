
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

var jNextWeekBtn = $("<input type='submit' id='next-week'>")
    .val("Semaine prochaine")
    .click(function(){

        currentMonday.setDate(
            currentMonday.getDate() + 7
        );

        display_calendar(currentMonday);
    }); 

var jPreviousWeekBtn = $("<input type='submit' id='previous-week'>")
    .val("Semaine précédente")
    .click(function(){

        currentMonday.setDate(
            currentMonday.getDate() - 7
        );

        display_calendar(currentMonday);
    });

function getMonday(date) {
    
    let d = new Date(date);
    
    let day = d.getDay();
    let diff = (day === 0) ? -6 : 1 - day;
    
    d.setDate(d.getDate() + diff);
    
    return d;
}
var currentMonday = getMonday(new Date());

function formatDate(date) {

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function toMinutes(time) {
    const [h, m, s] = time.split(':').map(Number);
    return h * 60 + m;
}

var jDayAddBtn = $("<input type='submit'>")
    .val("Ajouter")
    .addClass("add-event-button")
    .click(function(){
        $.ajax({
            type: "GET",
            url: "controleur.php",
            data: {
                action: "create_event_calendar",
                date_event: $(this).parent().attr("data-date")
            },
            dataType: "json",
            success: function(oRep) {
                display_calendar();
            },
            error: function(xhr, status, error){
                console.log("ERROR: ", error);
            },	
        });
    })

var jDayTitle = $("<div>")
    .addClass("calendar-event-title")
    .click(function(){
        var jTextareaTitle = $("<textarea>");
        var previous_text = $(this).html();
        var event_id = $(this).parent().data("event_id");
        jTextareaTitle.val(previous_text);
        jTextareaTitle.data("title", previous_text);
        jTextareaTitle.data("event_id", event_id);
        $(this).replaceWith(jTextareaTitle);
        jTextareaTitle.focus();
    });

var jDayDescription = $("<div>")
    .addClass("calendar-event-description")
    .click(function(){
        var jTextareaDescription = $("<textarea>");
        var previous_text = $(this).html();
        var event_id = $(this).parent().data("event_id");
        jTextareaDescription.val(previous_text);
        jTextareaDescription.data("description", previous_text);
        jTextareaDescription.data("event_id", event_id);
        $(this).replaceWith(jTextareaDescription);
        jTextareaDescription.focus();
    });

var jDayButton = $("<input type='submit'>")
    .val("Supprimer")
    .click(function(){
        $.ajax({
            type: "GET",
            url: "controleur.php",
            //headers: {"debug-data":true},
            data: {"action": "delete_event_calendar", "event_id": $(this).parent().data("event_id")},
            dataType: "json",
            success: function(oRep){
                display_calendar();
            },
            error: function(xhr, status, error){
                console.log("ERROR: ", error);
            },	
        });
    });

var jDayHour = $("<div>")
    .addClass("calendar-event-time")
    .click(function() {

        var $hourDiv = $(this);
        var event_id = $hourDiv.parent().data("event_id");

        var heure_debut = $hourDiv.data("heure_debut");
        var heure_fin = $hourDiv.data("heure_fin");

        var $dialog = $("<div>");

        var $debut = $("<input>", {type: "text"})
            .val(heure_debut);

        var $fin = $("<input>", {type: "text"})
            .val(heure_fin);

        $dialog
            .append("<p>Heure de début</p>")
            .append($debut)
            .append("<p>Heure de fin</p>")
            .append($fin);

        $debut.timepicker({
            timeFormat: 'HH:mm:ss',
            step: 5,
            showSeconds: false,
            forceRoundTime: true,
            defaultTime: '00:00:00',
            scrollDefault: "now",
            appendTo: $dialog
        });

        $fin.timepicker({
            timeFormat: 'HH:mm:ss',
            step: 5,
            showSeconds: false,
            forceRoundTime: true,
            defaultTime: '00:00:00',
            scrollDefault: "now",
            appendTo: $dialog
        });

        $dialog.dialog({
            modal: true,
            title: "Modifier l'horaire",
            buttons: {
                "Valider": function() {

                    var newDebut = $debut.val();
                    var newFin = $fin.val();

                    if (toMinutes(newDebut) <= toMinutes(newFin)) {
                        $.ajax({
                            type: "GET",
                            url: "controleur.php",
                            data: {
                                action: "update_hour_calendar",
                                event_id: event_id,
                                heure_debut: newDebut,
                                heure_fin: newFin
                            },
                            success: function() {

                                $hourDiv
                                    .data("heure_debut", newDebut)
                                    .data("heure_fin", newFin)
                                    .text(
                                        newDebut.substring(0,5)
                                        + " - " +
                                        newFin.substring(0,5)
                                    );

                                $(".ui-timepicker-container").hide();
                                $(".ui-timepicker-container").hide();
                                $dialog.dialog("destroy").remove();
                            }, 
                            error: function(xhr, status, error){
                                console.log("ERROR: ", error);
                            },	
                        });
                    }  else {
                        alert("L'heure de fin doit être après l'heure de début");
                    }
                },

                "Annuler": function () {

                    $(".ui-timepicker-container").hide();
                    $(".ui-timepicker-container").hide();
                    $dialog.dialog("destroy").remove();
                }
            },
        });
    });

const emotions = [
    "heureux",
    "triste",
    "stressé",
    "fatigué",
    "colère",
];

function majPointsBets() {

    let points = {};

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {action: "get_bet_on_user"},
        dataType: "json",
        success: function(bets) {
            let promesses = bets.map(bet => {
                return $.ajax({
                    type: "GET",
                    url: "controleur.php",
                    data: {
                        action: "get_day_emotion",
                        date_bet: bet.date_pari,
                        id_user: bet.friend_user_id
                    },
                    dataType: "json"
                }).then(function(oRep) {
                    if (oRep.length) {
                        let emotion = oRep[0];

                        if (emotion.emotion === bet.emotion) {

                            if (!points[bet.user_id]) {
                                points[bet.user_id] = 0;
                            }

                            points[bet.user_id]++;
                        }
                    }
                });
            });

            Promise.all(promesses).then(function() {

                for (const [id_user, nbPoints] of Object.entries(points)){
                    $.ajax({
                        type: "GET",
                        url: "controleur.php",
                        data: {action: "get_group_two_users", id_user: id_user},
                        dataType: "json",
                        success: function(groups){
                            groups.forEach(function(group){
                                $.ajax({
                                    type: "GET",
                                    url: "controleur.php",
                                    data: {"action": "set_points", "id_user": id_user, "id_group": group.group_id, "points": nbPoints},
                                    success: function(oRep){
                                        console.log(oRep);
                                    },
                                    error: function(xhr, status, error){
                                        console.log("ERROR", error);
                                    }
                                });
                            })
                        },
                        error: function(xhr, status, error){
                            console.log("ERROR: ", error);
                        }
                    });
                }
                    
            });
        }
    });
}

function setDayEmotion(emotion){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        //headers: {"debug-data":true},
        data: {"action": "set_day_emotion", "emotion": emotion},
        dataType: "json",
        success: function(oRep){
            majPointsBets();
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

function createCalendar(monday) {

    var jCalendar = $("<div>")
        .addClass("calendar");

    let sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

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

    for (let i = 0; i < 7; i++) {

        let current = new Date(monday);
        current.setDate(monday.getDate() + i);

        let dateStr = formatDate(current);

        jCalendar.append(
            $("<div>")
            .addClass("calendar-day")
            .attr("data-date", dateStr)
            .append(
                $("<div>")
                .addClass("calendar-day-title")
                .text(
                    current.toLocaleDateString(
                        "fr-FR",
                        {
                            weekday: "long",
                            day: "numeric",
                            month: "numeric"
                        }
                    )
                )
            )
            .append(jDayAddBtn.clone(true))
        );
    }

    return jCalendar;
}

function display_calendar(monday = currentMonday) {

    var calendar_div = $("#calendar");
    calendar_div.empty();

    // =====================
    // BOUTONS
    // =====================

    var controls = $("<div>")
        .addClass("calendar-controls")
        .append(jPreviousWeekBtn.clone(true))
        .append(jNextWeekBtn.clone(true));

    calendar_div.append(controls);

    var jCloneCalendar = createCalendar(monday);

    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {
            action: "get_user_calendar",
            date: formatDate(monday)
        },
        dataType: "json",
        success: function(oRep) {
            oRep.forEach(function(event) {
                var dayDiv = jCloneCalendar.find(
                    ".calendar-day[data-date='" + event.date_event + "']"
                );

                if (!dayDiv.length) return;

                dayDiv.append(
                    $("<div>")
                        .addClass("calendar-event")
                        .data("event_id", event.id)
                        .append(jDayTitle.clone(true).text(event.titre))
                        .append(jDayButton.clone(true))
                        .append(
                            jDayHour.clone(true)
                                .text(
                                    event.heure_debut.substring(0,5)
                                    + " - " +
                                    event.heure_fin.substring(0,5)
                                )
                                .data("heure_debut", event.heure_debut)
                                .data("heure_fin", event.heure_fin)
                        )
                        .append(jDayDescription.clone(true).text(event.description || ""))
                );
            });
            calendar_div.append(jCloneCalendar);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },	
    });
}

$(document).ready(function(){
    display_profile();
    display_mood();
    display_calendar();

    majPointsBets();
});



$(document).on("keyup", "textarea", function (context) {
    switch (context.key){
        case "Enter":

            var jComponent = $(this);
            var event_id = jComponent.parent().data("event_id");
            var new_text = jComponent.val();

            if (jComponent.data("title")){

                var previous_text = jComponent.data("title");

                var newJComponent = jDayTitle.clone(true)
                    .text(previous_text);

                jComponent.replaceWith(newJComponent);

                $.ajax({
                    type: "GET",
                    url: "controleur.php",
                    data: {
                        action: "update_title_calendar",
                        event_id: event_id,
                        title: new_text
                    },
                    dataType: "json",
                    success: function(oRep) {
                        newJComponent.replaceWith(jDayTitle.clone(true).text(new_text));
                    },
                    error: function(xhr, status, error){
                        console.log("ERROR: ", error);
                    },	
                });

            } else if (jComponent.data("description")){
                var previous_text = jComponent.data("description");

                var newJComponent = jDayDescription.clone(true)
                    .text(previous_text);

                jComponent.replaceWith(newJComponent);

                $.ajax({
                    type: "GET",
                    url: "controleur.php",
                    data: {
                        action: "update_description_calendar",
                        event_id: event_id,
                        description: new_text
                    },
                    dataType: "json",
                    success: function(oRep) {
                        newJComponent.replaceWith(jDayDescription.clone(true).text(new_text));
                    },
                    error: function(xhr, status, error){
                        console.log("ERROR: ", error);
                    },	
                });
            }

        break;
        case "Escape":
            
            if ($(this).data("title")){
                var previous_text = $(this).data("title");
                $(this).replaceWith(jDayTitle.clone(true).text(previous_text).data($(this).data()));
            } else if ($(this).data("description")) {
                var previous_text = $(this).data("description");
                $(this).replaceWith(jDayDescription.clone(true).text(previous_text).data($(this).data()));
            }

        break;

    }
});