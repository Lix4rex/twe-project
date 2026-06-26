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
        currentMonday.setDate(currentMonday.getDate() + 7);
        display_calendar(currentMonday);
    }); 

var jPreviousWeekBtn = $("<input type='submit' id='previous-week'>")
    .val("Semaine précédente")
    .click(function(){
        currentMonday.setDate(currentMonday.getDate() - 7);
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
    });

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
        var $debut = $("<input>", {type: "text"}).val(heure_debut);
        var $fin = $("<input>", {type: "text"}).val(heure_fin);

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
                                    .text(newDebut.substring(0,5) + " - " + newFin.substring(0,5));

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

function setDayEmotion(emotion){
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {"action": "set_day_emotion", "emotion": emotion},
        dataType: "json",
        success: function(oRep){
            display_user_header();
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },  
    });
}

async function display_user_header() {
    var profile_div = $("div[id='profile']");
    profile_div.empty();

    var user = null;
    try {
        var oRepUser = await $.ajax({
            type: "GET",
            url: "controleur.php",
            data: {"action": "get_user"},
            dataType: "json"
        });
        user = oRepUser[0];
    } catch(e) {
        console.log("Erreur profil: ", e);
    }

    var oRepDayEmotion = [];
    try {
        oRepDayEmotion = await $.ajax({
            type: "GET",
            url: "controleur.php",
            data: {"action": "get_day_emotion"},
            dataType: "json"
        });
    } catch(e) {
        console.log("Erreur humeur: ", e);
    }

    if (!user) return; 

    var $userBadge = $("<div>").addClass("user-badge-container");
    
    var $identity = $("<div>").addClass("user-identity")
        .append($("<span>").addClass("firstname").text(user.first_name + " "))
        .append($("<span>").addClass("lastname").text(user.last_name))
        .append($("<span>").addClass("username").text(" (@" + user.username + ")"));

    $userBadge.append($identity);

    var $moodZone = $("<div>").addClass("user-mood-zone");
    var todayStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    if (oRepDayEmotion.length) {
        var emotion = oRepDayEmotion[0].emotion;
        $moodZone.append($("<span>").addClass("mood-status-filled").text("Humeur (" + todayStr + ") : " + emotion));
        $userBadge.append($moodZone);
    } else {
        var $emotionsDiv = $("<div>").addClass("emotions-inline");
        
        emotions.forEach(function(emotionName){
            var $cb = $("<label>").addClass("emotion-inline-item")
                .append($("<input type='radio' name='emotion_user'>").val(emotionName))
                .append($("<span>").text(emotionName));
            $emotionsDiv.append($cb);
        });

        $moodZone.append($emotionsDiv).append(
            $("<input type='submit'>")
                .addClass("submit-mood-btn")
                .val("Valider l'humeur")
                .click(function(){
                    var selectedEmotion = $("input[name='emotion_user']:checked").val();
                    if (!selectedEmotion){
                        alert("Il faut choisir une émotion");
                        return;
                    }
                    setDayEmotion(selectedEmotion);
                })
        );
        $userBadge.append($moodZone);
    }

    profile_div.append($userBadge);
}

function createCalendar(monday) {
    // Conteneur externe de base
    var jCalendar = $("<div>").addClass("calendar-container");

    let sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // ÉLÉMENT 1 : Le Titre seul tout en haut
    jCalendar.append(
        $("<h2>")
            .addClass("calendar-week-title")
            .text("Semaine du " + monday.toLocaleDateString("fr-FR") + " au " + sunday.toLocaleDateString("fr-FR"))
    );

    // ÉLÉMENT 2 : La grille de 7 colonnes (mise à jour du nom de classe pour correspondre au CSS stable)
    var jDaysGrid = $("<div>").addClass("calendar-grid");

    for (let i = 0; i < 7; i++) {
        let current = new Date(monday);
        current.setDate(monday.getDate() + i);
        let dateStr = formatDate(current);

        jDaysGrid.append(
            $("<div>")
            .addClass("calendar-day")
            .attr("data-date", dateStr)
            .append(
                $("<div>")
                .addClass("calendar-day-title")
                .text(current.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "numeric" }))
            )
            .append(jDayAddBtn.clone(true))
        );
    }

    // On ajoute les jours sous le titre
    jCalendar.append(jDaysGrid);
    return jCalendar;
}

function display_calendar(monday = currentMonday) {
    // Ciblage du conteneur de structure (l'enveloppe à 82%)
    var calendar_section = $("#calendar-section");
    calendar_section.empty();

    // Recréation de la boîte blanche isolée comme dans l'autre module
    var calendar_box = $("<div>").attr("id", "calendar");

    var controls = $("<div>")
        .addClass("calendar-controls")
        .append(jPreviousWeekBtn.clone(true))
        .append(jNextWeekBtn.clone(true));

    // On injecte les contrôles dans le bloc blanc
    calendar_box.append(controls);

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
                var dayDiv = jCloneCalendar.find(".calendar-day[data-date='" + event.date_event + "']");

                if (!dayDiv.length) return;

                dayDiv.append(
                    $("<div>")
                        .addClass("calendar-event")
                        .data("event_id", event.id)
                        .append(jDayTitle.clone(true).text(event.titre))
                        .append(
                            jDayHour.clone(true)
                            .text(event.heure_debut.substring(0,5) + " - " + event.heure_fin.substring(0,5))
                            .data("heure_debut", event.heure_debut)
                            .data("heure_fin", event.heure_fin)
                        )
                        .append(jDayDescription.clone(true).text(event.description || ""))
                        .append(jDayButton.clone(true))
                );
            });
            // On ajoute le calendrier dans le bloc blanc, puis le bloc blanc dans la section de structure
            calendar_box.append(jCloneCalendar);
            calendar_section.append(calendar_box);
        },
        error: function(xhr, status, error){
            console.log("ERROR: ", error);
        },  
    });
}

$(document).on("click", "#delete-account-btn", function(){
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")){
        window.location = "controleur.php?action=delete_account";
    }
});

$(document).ready(function(){
    display_user_header();
    display_calendar();
});

$(document).on("keyup", "textarea", function (context) {
    switch (context.key){
        case "Enter":
            var jComponent = $(this);
            var event_id = jComponent.parent().data("event_id");
            var new_text = jComponent.val();

            if (jComponent.data("title")){
                var previous_text = jComponent.data("title");
                var newJComponent = jDayTitle.clone(true).text(previous_text);
                jComponent.replaceWith(newJComponent);

                $.ajax({
                    type: "GET",
                    url: "controleur.php",
                    data: { action: "update_title_calendar", event_id: event_id, title: new_text },
                    dataType: "json",
                    success: function(oRep) {
                        newJComponent.replaceWith(jDayTitle.clone(true).text(new_text));
                    },
                    error: function(xhr, status, error){ console.log("ERROR: ", error); },  
                });

            } else if (jComponent.data("description")){
                var previous_text = jComponent.data("description");
                var newJComponent = jDayDescription.clone(true).text(previous_text);
                jComponent.replaceWith(newJComponent);

                $.ajax({
                    type: "GET",
                    url: "controleur.php",
                    data: { action: "update_description_calendar", event_id: event_id, description: new_text },
                    dataType: "json",
                    success: function(oRep) {
                        newJComponent.replaceWith(jDayDescription.clone(true).text(new_text));
                    },
                    error: function(xhr, status, error){ console.log("ERROR: ", error); },  
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