let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;
let docName;
let docAddress;

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
        // Browser doesn't support geolocation
        handleLocationError(false, infoWindow);
    }
}

// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to Sydney, Australia
    pos = {lat: -33.856, lng: 151.215};
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Geolocation permissions denied. Using default location.' :
        'Error: Your browser does not support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;
    getNearbyPlaces(pos);
}

function getNearbyPlaces(position) {
    let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'doctor'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}

// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}

// Set markers at the location of each place result
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
            let request = {
                placeId: place.place_id,
                fields: ['name', 'types', 'formatted_address', 'geometry', 'rating',
                    'user_ratings_total']
            };

            /* Only fetch the details of a place when the user clicks on a marker.
            * If we fetch the details for all place results as soon as we get
            * the search response, we will hit API rate limits. */
            service.getDetails(request, (placeResult, status) => {
                showDetails(placeResult, marker, status)
            });
        });

        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
    });
    /* Once all the markers have been placed, adjust the bounds of the map to
    * show all the markers within the visible area. */
    map.fitBounds(bounds);
}

// Builds an InfoWindow to display details above the marker
function showDetails(placeResult, marker, status) {
    let placeName = placeResult.name;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        placeInfowindow.setContent('' +
            '<div class="bg-light" style="max-width: 400px">' +
            '<img src="male-doctor.png"/>    <strong style="font-size: medium"><b>' + placeName + '</b></strong>' +
            '<br><br>' +
            '<ul>' +
            '<li>' + placeResult.formatted_address + '</li><br>' +
            '<li>Hi, we are ' + placeName + ' and we would love to help you out with your medical needs!</li>' +
            '</ul>' +
            '<button type="button" class="btn btn-danger btn-block" onclick="' + informModal(placeResult) + '" data-toggle="modal" data-target="#bookingModal"> Book an Appointment </button>' +
            '</div>')
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showPanel(placeResult);
    } else {
        console.log('showDetails failed: ' + status);
    }
}

function informModal(placeResults) {
    document.getElementById('drName').innerHTML = placeResults.name;
    document.getElementById('address').innerHTML = placeResults.formatted_address;
    document.getElementById('description').innerHTML = placeResults.name;
    if(placeResults.rating==null){
        document.getElementById('rating').innerHTML = "No rating yet!";
    } else {
        document.getElementById('rating').innerHTML = "Rated " + placeResults.rating + " based on " + placeResults.user_ratings_total + " reviews.";
    }

    document.getElementById('dr').value = placeResults.name;
    document.getElementById('address').value = placeResults.formatted_address;

    setDoc(placeResults)
}

function setDoc(placeResults){
    docName = placeResults.name;
    docAddress = placeResults.formatted_address;
}

function bookingFormSubmit() {

}

function showModal() {
    document.getElementById('confirmedDrName').innerHTML = docName;
    document.getElementById('confirmedAddress').innerHTML = docAddress;
    $("#confirmationModal").modal('show');
}