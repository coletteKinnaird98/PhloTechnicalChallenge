<?php
$dr = null;
$address = null;
$date = null;
$time = null;
$fullName = null;
$email = null;
$chi = null;

if(isset($_POST["dr"])) {
    $dr = $_POST["dr"];
}
if(isset($_POST["address"])) {
    $address = $_POST["address"];
}
if (isset($_POST["date"])) {
    $date = $_POST["date"];
}
if (isset($_POST["time"])) {
    $time = $_POST["time"];
}
if (isset($_POST["fullName"])) {
    $fullName = $_POST["fullName"];
}
if (isset($_POST["email"])) {
    $email = $_POST["email"];
}
if (isset($_POST["chi"])) {
    $chi = $_POST["chi"];
}

if (is_null($date) && is_null($time) && is_null($fullName) && is_null($email)) {
} else {
    echo $dr;
    echo $address;
}

?>