<?php
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
    header("Location:../index.php?view=accueil");
    die("");
}
?>

<script src="js/jquery-3.5.1.min.js"></script>
<script src="js/calendar.js"></script>

<div id="corps">
    <h1>Calendriers</h1>
</div>

<div id="calendar_main_box">
    
    <div id="calendar-sidebar">
        <h2>Mes Amis</h2>
        <div id="friend-box">
            </div>
    </div>

    <div id="calendar-box-wrapper">
        <div id="calendar-box">
            <p class="select-friend-msg">Sélectionnez un ami dans la liste pour visualiser son emploi du temps.</p>
        </div>
    </div>

</div>