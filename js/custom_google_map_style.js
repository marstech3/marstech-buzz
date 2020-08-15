
var loc = new google.maps.LatLng(lat, lng);
var markerPos = new google.maps.LatLng(lat, lng);

function initMap() {
    var stylers = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers":
                    [
                        {"saturation": "-100"}
                    ]
        }
    ];

    var mapOptions = {
        zoom: zoom,
        center: loc,
        mapTypeId: 'Marstech Buzz',
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var styledMapOptions = {
        map: map
    }
    var marker = new google.maps.Marker({
        position: markerPos,
        map: map
    });

    var testmap = new google.maps.StyledMapType(stylers, styledMapOptions);

    map.mapTypes.set('Marstech Buzz', testmap);
    map.setMapTypeId('Marstech Buzz');
}