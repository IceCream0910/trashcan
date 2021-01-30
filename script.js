var map;


navigator.geolocation.getCurrentPosition(function(pos) {
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    console.log(latitude, longitude);

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
        mapOption = {
            center: new kakao.maps.LatLng(37.499776, 127.03895), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };
    map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    //빈공간 클릭했을 때
    $('#map').click(function(e) {
        if (!$(e.target).hasClass("marker")) {
            $('.mainwindow').show(100);
            $('.infowindow').hide(100);
        }
    });
});
var positions;
/////////////////////
firebase.initializeApp({
    apiKey: "AIzaSyDmNi6hH5Fo_H37KbSUGnFC-TPWOyWiNuw",
    authDomain: "trasncan-db.firebaseapp.com",
    databaseURL: "https://trasncan-db-default-rtdb.firebaseio.com",
    projectId: "trasncan-db",
    storageBucket: "trasncan-db.appspot.com",
    messagingSenderId: "433752322993"
});

var trashcansRef = firebase.database().ref('trashcans');
trashcansRef.on('child_added', function(snapshot) {
    var childData = snapshot.node_.children_.root_;
    var title = childData.right.value.value_;
    var loc = childData.left.value.value_;
    var tags = childData.value.value_;
    console.log(title, loc, tags);
    var locArr = loc.split(',');
    console.log(parseFloat(locArr[0]), parseFloat(locArr[1]));

    positions = [{
        title: title + ',' + tags,
        latlng: new kakao.maps.LatLng(parseFloat(locArr[0]), parseFloat(locArr[1])),
    }];
    addMarker();
});
//////////////////////



function addMarker() {
    // 마커를 표시할 위치와 title 객체 배열입니다 
    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < positions.length; i++) {

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지 
            clickable: true
        });


        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {
            console.log('click marker');
            $('.mainwindow').hide(100);
            $('.infowindow').show(100);
            var receivedTitle = (this.Fb).split(',');
            $('#title').html(receivedTitle[0]);
            $('.infowindow .tags_container').html('');
            for (var i = 1; i < receivedTitle.length; i++) {
                $('.infowindow .tags_container').append('<span class="tag">' + receivedTitle[i] + '</span>')
            }
        });
    }

}

function moveMyLoc() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;
        map.setLevel(3);
        var moveLatLon = new kakao.maps.LatLng(latitude, longitude);
        map.panTo(moveLatLon);
    });
}




/*
firebase.database().ref('trashcans/').once('value', function(snap) {
    var data = snap.val();
    var length = Object.keys(data).length;
    console.log(data);

    for (var i = 0; i < length; i++) {
        console.log(data[i]);
    }
 
})
   */