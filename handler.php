<?php

$date = null;
$time = null;
$fullName = null;
$email = null;
$chi = null;

if (isset($_POST["date"])) {
    $date = $_POST["date"];
    echo $date;
}
if (isset($_POST["time"])) {
    $time = $_POST["time"];
    echo $time;
}
if (isset($_POST["fullName"])) {
    $fullName = $_POST["fullName"];
    echo $fullName;
}
if (isset($_POST["email"])) {
    $email = $_POST["email"];
    echo $email;
}
if (isset($_POST["chi"])) {
    $chi = $_POST["chi"];
    echo $chi;
}

if (is_null($date) && is_null($time) && is_null($fullName) && is_null($email)) {
} else {
    echo '<script type="text/javascript">$("#confirmationModal").modal(\'show\');</script>';
}

?>