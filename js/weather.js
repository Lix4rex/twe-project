// ====================================================================
//  Onglet Météo - appels à l'API OpenWeather avec fetch + Promesses
//  (réseau en fetch comme dans le TP, affichage avec jQuery comme le
//   reste du site)
// ====================================================================

// Clé d'API OpenWeather. REMPLACE-LA par ta propre clé
// (https://home.openweathermap.org/api_keys).
const apiKey = "a08807a5e6c7223bf1c221f8f87580a4";

// URLs de base des différents services d'OpenWeather
const currentWeatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&lang=fr`;
const geocodingAPIUrl       = `https://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}`;


// --------------------------------------------------------------------
//  Fonctions utilitaires
// --------------------------------------------------------------------

// Convertit un timestamp Unix (en secondes) + décalage de fuseau (en secondes)
// en une heure lisible (HH:MM:SS) dans le fuseau du lieu.
function formatHeure(unixSeconds, timezoneOffset){
    var d = new Date((unixSeconds + timezoneOffset) * 1000);
    var h = ("0" + d.getUTCHours()).slice(-2);
    var m = ("0" + d.getUTCMinutes()).slice(-2);
    var s = ("0" + d.getUTCSeconds()).slice(-2);
    return h + ":" + m + ":" + s;
}

// Convertit une direction du vent en degrés vers un point cardinal.
function degVersCardinal(deg){
    if (deg === undefined || deg === null) return "-";
    var dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
    var i = Math.round(deg / 22.5) % 16;
    return dirs[i] + " (" + deg + "°)";
}

// Affiche un message d'erreur dans la page.
function afficherErreur(message){
    $("#weather-message").removeClass("success").addClass("error").html(message);
    $("#weather-result").empty();
}


// --------------------------------------------------------------------
//  Appels réseau (fetch -> Promesses)
// --------------------------------------------------------------------

// Récupère les conditions météo courantes pour des coordonnées données.
// Renvoie une promesse résolue avec l'objet JSON renvoyé par l'API.
function recupererMeteo(latitude, longitude){
    return fetch(currentWeatherAPIUrl + `&lat=${latitude}&lon=${longitude}`)
        .then(function(response){
            if (!response.ok) throw new Error("Erreur réseau (" + response.status + ")");
            return response.json();
        });
}


// --------------------------------------------------------------------
//  Affichage de TOUTES les infos renvoyées par l'API
// --------------------------------------------------------------------
function afficherDonnees(data, nomLieu){
    $("#weather-message").empty().removeClass("error success");
    var result = $("#weather-result");
    result.empty();
    $("#weather-history").empty();

    var tz = data.timezone || 0;

    // En-tête : nom du lieu + icône + description
    var titre = nomLieu || (data.name ? data.name : "Lieu inconnu");
    if (data.sys && data.sys.country) titre += ", " + data.sys.country;

    var entete = $("<div>").addClass("weather-header");
    if (data.weather && data.weather[0] && data.weather[0].icon){
        entete.append(
            $("<img>").addClass("weather-icon")
                .attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
        );
    }
    var textHead = $("<div>");
    textHead.append($("<h2>").html(titre));
    if (data.weather && data.weather[0]){
        textHead.append($("<p>").addClass("weather-desc").html(data.weather[0].description));
    }
    if (data.main){
        textHead.append($("<p>").addClass("weather-temp-big").html(Math.round(data.main.temp) + " °C"));
    }
    entete.append(textHead);
    result.append(entete);

    // Tableau détaillé de toutes les valeurs disponibles
    var rows = [];

    if (data.main){
        rows.push(["Température", data.main.temp + " °C"]);
        rows.push(["Ressenti", data.main.feels_like + " °C"]);
        rows.push(["Température min", data.main.temp_min + " °C"]);
        rows.push(["Température max", data.main.temp_max + " °C"]);
    }

    if (data.weather && data.weather[0]){
        rows.push(["Conditions", data.weather[0].main + " - " + data.weather[0].description]);
    }

    if (data.wind){
        rows.push(["Vent (vitesse)", data.wind.speed + " m/s"]);
    }

    if (data.clouds)     rows.push(["Nuages", data.clouds.all + " %"]);
    if (data.rain && data.rain["1h"] !== undefined) rows.push(["Pluie (1h)", data.rain["1h"] + " mm"]);
    if (data.snow && data.snow["1h"] !== undefined) rows.push(["Neige (1h)", data.snow["1h"] + " mm"]);

    if (data.sys){
        if (data.sys.country) rows.push(["Pays", data.sys.country]);
        if (data.sys.sunrise) rows.push(["Lever du soleil", formatHeure(data.sys.sunrise, tz) + " (heure locale)"]);
        if (data.sys.sunset)  rows.push(["Coucher du soleil", formatHeure(data.sys.sunset, tz) + " (heure locale)"]);
    }

    if (data.dt)       rows.push(["Mesure effectuée à", formatHeure(data.dt, tz) + " (heure locale)"]);

    var table = $("<table>").addClass("weather-table");
    rows.forEach(function(r){
        table.append(
            $("<tr>")
                .append($("<td>").addClass("weather-label").html(r[0]))
                .append($("<td>").addClass("weather-value").html(r[1]))
        );
    });
    result.append(table);

    // Jours précédents : vraies données passées de la ville (via Open-Meteo),
    // sous forme de tableau + graphiques
    if (data.coord){
        afficherJoursPrecedents(data.coord.lat, data.coord.lon, nomLieu || data.name);
    }
}


// --------------------------------------------------------------------
//  Jours précédents (vraies données passées) : tableau + graphiques
// --------------------------------------------------------------------

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

// Affiche les vraies données météo des jours précédents pour une ville (Open-Meteo)
function afficherJoursPrecedents(lat, lon, ville){
    var box = $("#weather-history");
    box.empty();

    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon
            + "&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum"
            + "&past_days=7&forecast_days=1&timezone=auto";

    fetch(url)
        .then(function(response){ return response.json(); })
        .then(function(d){
            if (!d.daily || !d.daily.time){ return; }

            var jours = d.daily.time;
            var aujourdhui = new Date().toISOString().slice(0, 10);

            box.append($("<h3>").html("Météo des jours précédents - " + ville));

            var table = $("<table>").addClass("weather-history-table");
            table.append(
                $("<tr>")
                    .append($("<th>").html("Date"))
                    .append($("<th>").html("Conditions"))
                    .append($("<th>").html("Temp. min"))
                    .append($("<th>").html("Temp. max"))
                    .append($("<th>").html("Vent max"))
                    .append($("<th>").html("Précipitations"))
            );

            // Données pour les graphiques (ordre chronologique : ancien -> récent)
            var labels = [], tMin = [], tMax = [], precip = [];

            // Tableau : du plus récent au plus ancien, uniquement les jours AVANT aujourd'hui
            var ajoute = 0;
            for (var i = jours.length - 1; i >= 0; i--){
                if (jours[i] >= aujourdhui) continue;
                table.append(
                    $("<tr>")
                        .append($("<td>").html(jours[i]))
                        .append($("<td>").html(codeMeteoFr(d.daily.weather_code[i])))
                        .append($("<td>").html(d.daily.temperature_2m_min[i] + " °C"))
                        .append($("<td>").html(d.daily.temperature_2m_max[i] + " °C"))
                        .append($("<td>").html(d.daily.wind_speed_10m_max[i] + " km/h"))
                        .append($("<td>").html(d.daily.precipitation_sum[i] + " mm"))
                );
                ajoute++;
            }

            if (ajoute === 0){ box.empty(); return; }

            // Remplissage des séries pour les graphiques (ordre chronologique)
            for (var j = 0; j < jours.length; j++){
                if (jours[j] >= aujourdhui) continue;
                labels.push(jours[j].slice(5)); // MM-JJ
                tMin.push(d.daily.temperature_2m_min[j]);
                tMax.push(d.daily.temperature_2m_max[j]);
                precip.push(d.daily.precipitation_sum[j]);
            }

            // Graphiques d'abord, puis tableau détaillé
            tracerGraphiques(box, labels, tMin, tMax, precip);
            box.append(table);
        })
        .catch(function(err){
            console.log("ERROR jours précédents: ", err);
        });
}

// Trace deux graphiques (températures min/max en courbe, précipitations en barres)
var chartTemp = null;
var chartPrecip = null;

function tracerGraphiques(box, labels, tMin, tMax, precip){
    // Si Chart.js n'a pas pu se charger, on n'affiche que le tableau
    if (typeof Chart === "undefined"){ return; }

    var wrapTemp = $("<div>").addClass("weather-chart");
    var canvasTemp = $("<canvas>");
    wrapTemp.append(canvasTemp);
    box.append($("<h3>").html("Températures (jours précédents)"));
    box.append(wrapTemp);

    var wrapPrecip = $("<div>").addClass("weather-chart");
    var canvasPrecip = $("<canvas>");
    wrapPrecip.append(canvasPrecip);
    box.append($("<h3>").html("Précipitations (jours précédents)"));
    box.append(wrapPrecip);

    // On détruit les anciens graphiques pour éviter les conflits de canvas
    if (chartTemp)   { chartTemp.destroy();   chartTemp = null; }
    if (chartPrecip) { chartPrecip.destroy(); chartPrecip = null; }

    chartTemp = new Chart(canvasTemp[0].getContext("2d"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "Temp. max (°C)", data: tMax, borderColor: "#c0392b",
                  backgroundColor: "rgba(192,57,43,0.1)", tension: 0.3, fill: true },
                { label: "Temp. min (°C)", data: tMin, borderColor: "#2980b9",
                  backgroundColor: "rgba(41,128,185,0.1)", tension: 0.3, fill: true }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false,
                   plugins: { legend: { position: "bottom" } } }
    });

    chartPrecip = new Chart(canvasPrecip[0].getContext("2d"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                { label: "Précipitations (mm)", data: precip,
                  backgroundColor: "#2980b9" }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false,
                   plugins: { legend: { position: "bottom" } },
                   scales: { y: { beginAtZero: true } } }
    });
}


// --------------------------------------------------------------------
//  Scénarios d'utilisation
// --------------------------------------------------------------------

// Météo à partir d'un nom de ville (géocodage direct puis météo)
function afficherMeteoParVille(ville){
    $("#weather-message").removeClass("error success").html("Recherche en cours...");

    fetch(geocodingAPIUrl + `&q=${encodeURIComponent(ville)}&limit=1`)
        .then(function(response){ return response.json(); })
        .then(function(data){
            if (!data.length){
                throw new Error("Aucune localité connue au nom de « " + ville + " »");
            }
            var lieu = data[0];
            var nom = lieu.name + (lieu.country ? ", " + lieu.country : "");
            return recupererMeteo(lieu.lat, lieu.lon).then(function(meteo){
                afficherDonnees(meteo, nom);
            });
        })
        .catch(function(err){
            afficherErreur("Erreur : " + err.message);
        });
}


// --------------------------------------------------------------------
//  Suggestions de villes (recherche pendant la frappe)
// --------------------------------------------------------------------
var villeSearchTimeout = null;

// Construit un libellé lisible pour une ville renvoyée par le géocodage
function libelleVille(lieu){
    var label = lieu.name;
    if (lieu.state)   label += ", " + lieu.state;
    if (lieu.country) label += ", " + lieu.country;
    return label;
}

// Affiche directement la météo d'un lieu déjà géocodé (lat/lon connus)
function afficherMeteoLieu(lieu){
    $("#weather-suggestions").empty();
    $("#weather-city-input").val(lieu.name);
    $("#weather-message").removeClass("error success").html("Recherche en cours...");
    recupererMeteo(lieu.lat, lieu.lon)
        .then(function(meteo){ afficherDonnees(meteo, libelleVille(lieu)); })
        .catch(function(err){ afficherErreur("Erreur : " + err.message); });
}

// Recherche des villes correspondant au texte saisi et affiche les suggestions
function rechercherVilles(terme){
    var box = $("#weather-suggestions");

    fetch(geocodingAPIUrl + `&q=${encodeURIComponent(terme)}&limit=5`)
        .then(function(response){ return response.json(); })
        .then(function(data){
            box.empty();
            if (!data.length) return;

            data.forEach(function(lieu){
                var jSugg = $("<div>")
                    .addClass("suggestion-item")
                    .html(libelleVille(lieu));
                jSugg.click(function(){
                    afficherMeteoLieu(lieu);
                });
                box.append(jSugg);
            });
        })
        .catch(function(err){
            console.log("ERROR: ", err);
        });
}


// --------------------------------------------------------------------
//  Initialisation
// --------------------------------------------------------------------
$(document).ready(function(){

    $("#weather-search-btn").click(function(){
        var ville = $("#weather-city-input").val().trim();
        if (!ville){
            afficherErreur("Veuillez saisir le nom d'une ville.");
            return;
        }
        $("#weather-suggestions").empty();
        afficherMeteoParVille(ville);
    });

    $("#weather-city-input").keypress(function(e){
        if (e.which == 13){
            $("#weather-search-btn").click();
        }
    });

    // Suggestions de villes pendant la frappe (avec petit délai)
    $("#weather-city-input").on("input", function(){
        var terme = $(this).val().trim();
        clearTimeout(villeSearchTimeout);
        if (terme.length < 2){
            $("#weather-suggestions").empty();
            return;
        }
        villeSearchTimeout = setTimeout(function(){
            rechercherVilles(terme);
        }, 300);
    });

});
