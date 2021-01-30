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
var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(setlat, setlon), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng;
    displayMarker(latlng);
});


function markerOnGeo() {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {

            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition);

        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
        displayMarker(locPosition);
    }

}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition) {

    $('#latlon').val(locPosition.toString().replace("(", "").replace(")", ""));

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });


    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);
}



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
    var username = "tester01",
        title = $('#name').val(),
        coords = $('#latlon').val(),
        tags = $('#tag').val();

    if (title != null || coords != null || tags != null) {


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
        history.back();
    } else {
        alert('항목을 입력해주세요');
    }

}