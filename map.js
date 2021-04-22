// Declare global variables
let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;

// Creates map, sets bounds and attempts to get users geolocation
function initMap() {
    // Initialize variables
    bounds = new google.maps.LatLngBounds();
    infoWindow = new google.maps.InfoWindow;
    currentInfoWindow = infoWindow;

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 15
            });
            bounds.extend(pos);

            new google.maps.Marker({
                position: pos,
                map: map,
                title: name,
                icon: 'location.png'
            });

            getNearbyPlaces(pos);
        }, () => {
            // Browser supports geolocation, but user has denied permission
            handleLocationError(true, infoWindow);
        });
    } else {
        // Browser does not support geolocation
        handleLocationError(false, infoWindow);
    }
}

// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to London, UK
    pos = {lat: 51.509865, lng: -0.118092};
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        // Displays if browser supports geolocation, but user has denied permission (browserHasGeolocation == true)
        'Geolocation permissions denied. Using default location.' :
        // Displays if browser does not support geolocation (browserHasGeolocation == false)
        'Error: Your browser does not support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;
    getNearbyPlaces(pos);
}

// Creates a request to the Places service to find doctors near users geolocation
function getNearbyPlaces(position) {
    // Find doctors near user geolocation
    let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'doctor'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}

// Handle the results of search for nearby doctors returning an array of PlaceResult objects
function nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}

// Set icon marker at the location of each doctor and add click listeners to each marker
function createMarkers(places) {
    places.forEach(place => {
        let marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            icon: 'male-doctor.png'
        });

        // Add click listener to each marker
        google.maps.event.addListener(marker, 'click', () => {
            // Fetch the details of a doctor when the user clicks on a marker
            let request = {
                placeId: place.place_id,
                fields: ['name', 'types', 'formatted_address', 'geometry', 'rating',
                    'user_ratings_total']
            };

            // Display the details of a doctor when the user clicks on a marker
                service.getDetails(request, (placeResult, status) => {
                showDetails(placeResult, marker, status)
            });
        });

        // Adjust the map bounds to include the location of marker
        bounds.extend(place.geometry.location);
    });
    // Once all the markers have been placed, map bounds to show all markers within visible area.
    map.fitBounds(bounds);
}

// Builds InfoWindow to display doctor details on marker click
function showDetails(placeResult, marker, status) {
    let doctorName = placeResult.name;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        placeInfowindow.setContent('' +
            '<div class="bg-light" style="max-width: 400px">' +
            '<img src="male-doctor.png"/>    <strong style="font-size: medium"><b>' + doctorName + '</b></strong>' +
            '<br><br>' +
            '<ul>' +
            '<li>' + placeResult.formatted_address + '</li><br>' +
            '<li>Hi, we are ' + doctorName + ' and we would love to help you out with your medical needs!</li>' +
            '</ul>' +
            '<button type="button" class="btn btn-danger btn-block" onclick="' + openBookingForm(placeResult) + '" data-toggle="modal" data-target="#bookingModal"> Book an Appointment </button>' +
            '</div>')
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
    } else {
        console.log('showDetails failed: ' + status);
    }
}

// Opens bootstrap modal containing booking form and sends doctor details to the modal (name, address, rating) within left column of modal
function openBookingForm(placeResults) {
    document.getElementById('drName').innerHTML = placeResults.name;
    document.getElementById('address').innerHTML = placeResults.formatted_address;
    document.getElementById('description').innerHTML = placeResults.name;
    if(placeResults.rating==null){
        document.getElementById('rating').innerHTML = "No rating yet!";
    } else {
        document.getElementById('rating').innerHTML = "Rated " + placeResults.rating + " based on " + placeResults.user_ratings_total + " reviews.";
    }

    // Sets hidden form field values
    document.getElementById('drForm').value = placeResults.name;
    document.getElementById('addressForm').value = placeResults.formatted_address;
}

// Opens bootstrap modal confirming user booking
function openBookingConfirmation() {
    $('#confirmationModal').modal('show');
    //document.getElementById('confirmationModal').showModal();
}