function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


var map;
var setlat = getParameterByName('lat');
var setlon = getParameterByName('lon');
console.log(setlat, setlon);
$('#latlon').val(setlat + ', ' + setlon);


var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(setlat, setlon), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다


function markerOnGeo() {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            $('#latlon').val(lat + ', ' + lon);

        });

    }

}


// 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'center_changed', function() {
    // 지도의 중심좌표를 얻어옵니다 
    var latlng = map.getCenter();
    $('#latlon').val(latlng.getLat() + ', ' + latlng.getLng());

});



/////////////////////
firebase.initializeApp({
    apiKey: "AIzaSyDmNi6hH5Fo_H37KbSUGnFC-TPWOyWiNuw",
    authDomain: "trasncan-db.firebaseapp.com",
    databaseURL: "https://trasncan-db-default-rtdb.firebaseio.com",
    projectId: "trasncan-db",
    storageBucket: "trasncan-db.appspot.com",
    messagingSenderId: "433752322993"
});

function writeNewPost() {
    var username = "test",
        title = $('#name').val(),
        coords = $('#latlon').val(),
        tags = $('#tag').val();

    if (title == '' || coords == '' || tags == '') {
        alert('모든 항목을 입력해주세요');
    } else {
        console.log(title, coords, tags);

        var postData = {
            author: username, //유저네임
            uid: null,
            location: coords, //좌표
            title: title, //이름
            reportCount: 0, //신고횟수
            tags: tags //태그
        };

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('trashcans').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/trashcans/' + newPostKey] = postData;

        return firebase.database().ref().update(updates);
    }


}