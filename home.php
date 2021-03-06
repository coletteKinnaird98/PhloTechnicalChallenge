<?php
// Declare variables
$dr = null;
$address = null;
$date = null;
$time = null;
$fullName = null;
$email = null;
$chi = null;

// Set variables to $_POST values if set
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

if (isset($dr) && isset($address) && isset($date) && isset($time) && isset($fullName) && isset($email)) {
    /*
    require_once "configure.php";

    if (!$db) {
        die("Connection Failed: " . mysqli_connect_error());
    } else {
        if(isset($chi)) {
            $sql = "INSERT INTO appointments ('appointment_id', 'dr_name', 'date', 'time', 'patient_name', 'patient_email', 'patient_chi') VALUES (NULL, '$dr', '$address', '$fullName', '$email', '$chi')";
        } else {
            $sql = "INSERT INTO appointments ('appointment_id', 'dr_name', 'date', 'time', 'patient_name', 'patient_email', 'patient_chi') VALUES (NULL, '$dr', '$address', '$fullName', '$email', NULL)";
        }
        mysqli_query($db, $sql);
        mysqli_close($db);
    }
    */
    sendEmail($dr, $date, $time, $fullName, $email);
}

function sendEmail($dr, $date, $time, $fullName, $email)
{
    if (!is_null($date) && !is_null($time) && !is_null($fullName) && !is_null($email)) {
        $message = "Hi $fullName, thank you so much for booking!\n\n Your appointment with $dr is confirmed for $date at $time.\n\n We look forward to seeing you then.";
    }

    // send email
    mail("$email", "Appointment Confirmation", $message);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Homepage</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
            integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
            crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
            crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossorigin="anonymous"></script>
    <style>
        #map {
            height: 100%;
            background-color: grey;
        }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <nav class="navbar navbar-expand-sm bg-light navbar-light fixed-top">
        <a class="navbar-brand" href="home.php"><img src="cross.png" alt="Logo" width="35"> Doc.ly</a>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
                <a class="nav-link" href="home.php">Find a Doctor</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Services</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Care Plans</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">About</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Emergency</a>
            </li>
        </ul>
    </nav>
</div>

<div id="map"></div>

<div class="modal" id="bookingModal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title">Book an Appointment</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        Booking with...
                        <br><br>
                        <img src="male-doctor.png"/> <strong id="drName" style="font-size: large"></strong><br><br>
                        <ul>
                            <li id="address"></li>
                            <br>
                            <li>Hi, we are
                                <text id="description"></text>
                                and we would love to help you out with your medical needs!
                            </li>
                            <br>
                            <li>Specialists on <b>Doc.ly</b> since 2019</li>
                            <br>
                            <li id="rating">Rating</li>
                        </ul>
                    </div>
                    <div class="col-md-6 bg-light">
                        <p style="font-size: small">Please fill out the form below to book your appointment.</p>
                        <br>
                        <form action="home.php" method="post" id="bookingForm">
                            <div class="form-group">
                                <label for="date">Select a day*</label>
                                <input type="date" name="date" class="form-control" id="date" required>
                                <div class="invalid-feedback">
                                    Please choose a date.
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="time">Select a timeslot*</label>
                                <input type="hidden" name="dr" id="drForm">
                                <input type="hidden" name="address" id="addressForm">
                                <input type="time" name="time" class="form-control" id="time" required>
                                <div class="invalid-feedback">
                                    Please choose a time.
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="fullName">Full name*</label>
                                <input type="text" name="fullName" class="form-control" id="fullName"
                                       placeholder="Enter your full name" required>
                                <div class="invalid-feedback">
                                    Please enter your full name.
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email address*</label>
                                <input type="email" name="email" class="form-control" id="email"
                                       placeholder="Enter your email address" required>
                                <div class="invalid-feedback">
                                    Please enter your email address.
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="chi">NHS CHI number (optional)</label>
                                <input type="number" name="chi" class="form-control" id="chi"
                                       placeholder="Unique 10-digit number">
                            </div>

                            <input type="submit" class="button btn btn-danger btn-block" id="submitButton" value="Book Appointment" name="submitButton">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="confirmationModal">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title">Appointment Booked</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <b>Thanks, you've made a booking with...</b>
                <br><br>
                <img src="male-doctor.png"/> <strong id="confirmedDrName" style="font-size: large"><?php echo $dr ?></strong><br><br>
                <ul>
                    <li id="confirmedAddress"><?php echo $address ?></li>
                    <br>
                    <li><?php echo $date ?></li>
                    <br>
                    <li><?php echo $time ?></li>
                </ul>
                <p>We've sent a booking confirmation to the email address you provided</p>
            </div>

            <div class="modal-footer">
                <text style="font-size: small">Didn't receive an email?</text>
                <button type="button" class="btn btn-block btn-danger" onclick="<?php sendEmail($dr, $date, $time, $fullName, $email); ?>">Resend Email</button>
            </div>
        </div>
    </div>
</div>
<script src="map.js"></script>
<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAV-SC7iaV3XlcBzpxIrDGRdqPLoVi_cUA&libraries=places&callback=initMap"></script>
<?php
// If $_POST values received from server, display confirmation modal
if (!is_null($date) && !is_null($time) && !is_null($fullName) && !is_null($email)) {
    echo '<script type="text/javascript">openBookingConfirmation()</script>';
}
?>
</body>
</html>