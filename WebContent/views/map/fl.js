//创建和初始化地图函数：
function initMap() {

    createMap();// 创建地图
    // display();
    addMarkerCity();
    toHome();
    goBack();
    setMapEvent();// 设置地图事件
}

var dataset = {
    initzoom: 6,
    cityzoom: 10,
    properzoom: 13,
    villagezoom: 15,
}

// 创建地图函数：
function createMap() {

    var map = new BMap.Map("dituContent", {
        enableMapClick: false
    });

    var point = new BMap.Point(108.923468, 36.067843);// 定义一个中心点坐标

    map.centerAndZoom(point, dataset.initzoom);// 设定地图的中心点和坐标并将地图显示在地图容器中
    map.setMinZoom(5);
    map.setMaxZoom(15);

    map.setMapStyle({// 去掉地图内多余样式
        styleJson: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#ccd6d7ff"
            }
        }, {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#dee5e5ff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.topfill",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.sidefill",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#aab6b6ff"
            }
        }, {
            "featureType": "subwaystation",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "color": "#888fa0ff"
            }
        }, {
            "featureType": "education",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#e1e7e7ff"
            }
        }, {
            "featureType": "medical",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 4
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 2
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 1
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9494941a"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff1a"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#c3bed433"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff33"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#979c9aff"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#333333ff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#454d50ff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "town",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#454d50ff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#888fa0ff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "otherlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "village",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
                "color": "#edf3f3ff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,8",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,8",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8f5a33ff"
            }
        }, {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8f5a33ff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text",
            "stylers": {
                "fontsize": 28
            }
        }, {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#dfe7e7ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "manmade",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "manmade",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "scenicspotslabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "scenicspotslabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "medicallabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "medicallabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "hotellabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "hotellabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "shoppinglabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "shoppinglabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportationlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportationlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "entertainment",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "estate",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "shopping",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "education",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "education",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "medical",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "medical",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }]
    });

    window.map = map;// 将map变量存储在全局

    map.addEventListener('dragend', function() {

        var zoom = map.getZoom();
        var center = map.getCenter();

        console.log("----------------dragend-------------------")
        console.log(zoom);

        if (zoom == dataset.villagezoom) {
            addMarkerStreet(center.lng, center.lat);
        }
    });

    map.addEventListener('zoomend', function() {

        var zoom = map.getZoom();
        var center = map.getCenter();

        console.log("----------------zoomend-------------------")
        console.log(zoom);

        if (zoom == dataset.cityzoom) {
            addMarkerCity();
        } else if (zoom == dataset.properzoom) {
            addMarkerPlot();
        } else if (zoom == dataset.villagezoom) {
            addMarkerStreet(center.lng, center.lat);
        }
    });

    // map.addEventListener('moveend', function() {
    //
    // var zoom = map.getZoom();
    //
    // console.log("----------------moveend-------------------")
    // console.log(zoom);
    //
    // // if (zoom == dataset.cityzoom) {
    // // addMarkerCity();
    // // } else if (zoom == dataset.properzoom) {
    // // addMarkerPlot();
    // // } else if (zoom == dataset.villagezoom) {
    // // addMarkerStreet(123.438973, 41.811339)
    // // }
    // });
}

// 地图事件设置函数：
function setMapEvent() {

    // map.enableDragging();// 启用地图拖拽事件，默认启用(可不写)
    // map.disableScrollWheelZoom();// 禁止地图滚轮放大缩小
    // map.disableDoubleClickZoom();//禁止鼠标双击放大，默认启用(可不写)
    // map.disablePinchToZoom();// 禁用双指操作缩放。
    // map.enableKeyboard();// 启用键盘上下左右键移动地图
    // map.disableResizeOnCenter();

    // map.enableScrollWheelZoom();
}

function addMarkerCity() {

    console.log("----------------draw city-------------------")

    map.clearOverlays();

    var geoc = new BMap.Geocoder();
    var bound = map.getBounds();

    var citys = [{
        "x": 123.424527,
        "y": 41.803319,
        "name": "沈阳",
        "consult": "15393"
    }, {
        "x": 114.3162,
        "y": 30.581084,
        "name": "武汉",
        "consult": "876"
    }, {
        "x": 117.282699,
        "y": 31.866942,
        "name": "合肥",
        "consult": "1287"
    }, {
        "x": 126.657717,
        "y": 45.773225,
        "name": "哈尔滨",
        "consult": "863"
    }, {
        "x": 125.313642,
        "y": 43.898338,
        "name": "长春",
        "consult": "387"
    }, {
        "x": 106.530635,
        "y": 29.544606,
        "name": "重庆",
        "consult": "98"
    }]

    $.each(citys, function(i, v) {

        var point = new BMap.Point(v.x, v.y);
        var myLabel = createMyLabel(point, v.name, v.consult);

        map.addOverlay(myLabel);

        (function() {

            var _myLabel = myLabel;
            _myLabel.addEventListener("click", function(e) {

                map.setZoom(dataset.properzoom);
                map.panTo(new BMap.Point(v.x, v.y), {
                    noAnimation: true
                });
                addMarkerPlot()
            })
        })()
    })

}

// 添加区标记
function addMarkerPlot() {

    console.log("----------------draw proper-------------------")

    map.clearOverlays();

    var geoc = new BMap.Geocoder();
    var bound = map.getBounds();

    var plots = [{
        "x": 123.281679,
        "y": 41.779136,
        "cityProperName": "铁西",
        "consult": "5001"
    }, {
        "x": 123.464969,
        "y": 41.80228,
        "cityProperName": "沈河",
        "consult": "4201"
    }, {
        "x": 123.431049,
        "y": 41.826366,
        "cityProperName": "皇姑",
        "consult": "864"
    }, {
        "x": 123.427025,
        "y": 41.795827,
        "cityProperName": "和平",
        "consult": "731"
    }, {
        "x": 123.474168,
        "y": 41.811851,
        "cityProperName": "大东",
        "consult": "582"
    }]

    $.each(plots, function(i, v) {

        var point = new BMap.Point(v.x, v.y);
        var myLabel = createMyLabel(point, v.cityProperName, v.consult);// );

        map.addOverlay(myLabel);

        (function() {

            var _myLabel = myLabel;
            _myLabel.addEventListener("click", function(e) {

                map.setZoom(dataset.villagezoom);
                map.panTo(new BMap.Point(v.x, v.y), {
                    noAnimation: true
                });
                var center = map.getCenter();
                addMarkerStreet(v.x, v.y);
            })
        })()

    })

}

// //添加街道标记
function addMarkerStreet(x, y) {

    console.log("----------------draw village-------------------")

    map.clearOverlays();

    var bound = map.getBounds();
    var geoc = new BMap.Geocoder();

    var street = [{
        "x": 123.438973,
        "y": 41.811339,
        "villageName": "兴华街北二路",
        "count": "101"
    }, {
        "x": 123.477761,
        "y": 41.814808,
        "villageName": "百乐小区",
        "count": "61"
    }, {
        "x": 123.478695,
        "y": 41.817443,
        "villageName": "鑫龙小区",
        "count": "85"
    }, {
        "x": 123.473305,
        "y": 41.816744,
        "villageName": "龙福家园",
        "count": "101"
    }, {
        "x": 123.43033,
        "y": 41.826528,
        "villageName": "庐山社区",
        "count": "10"
    }, {
        "x": 123.430007,
        "y": 41.830747,
        "villageName": "漓江园",
        "count": "70"
    }, {
        "x": 123.441146,
        "y": 41.82849,
        "villageName": "乐天圣苑",
        "count": "48"
    }, {
        "x": 123.376073,
        "y": 41.820453,
        "villageName": "金帝名京",
        "count": "55"
    }, {
        "x": 123.37036,
        "y": 41.813384,
        "villageName": "阳光嘉园",
        "count": "36"
    }, {
        "x": 123.467565,
        "y": 41.800815,
        "villageName": "翠生社区",
        "count": "21"
    }, ]

    $.each(street, function(i, v) {

        var point = new BMap.Point(v.x, v.y);
        var iconImg = createIcon();
        var marker = new BMap.Marker(point, {
            "icon": iconImg
        });
        var redLabel = createRedLabel(v.villageName + "  |  " + v.count + "套");

        marker.setLabel(redLabel);

        if (bound.containsPoint(point) == true) {
            map.addOverlay(marker);
        } else {
            map.removeOverlay(marker);
        }

        geoc.getLocation(point, function(rs) {

            var addComp = rs.addressComponents;
            var address = addComp.district + addComp.street + addComp.streetNumber;
            (function() {

                var _marker = marker;
                var greenLabel = createGreenLabel(v.villageName, v.count, address);

                _marker.addEventListener("onmouseover", function() {

                    showMarker(_marker, greenLabel);
                });
                _marker.addEventListener("onmouseout", function() {

                    removeMarker(_marker, greenLabel)
                })
                redLabel.addEventListener("onmouseover", function(e) {

                    showMarker(_marker, greenLabel);
                })
                greenLabel.addEventListener('mouseout', function() {

                    removeMarker(_marker, greenLabel)
                })
            })()
        });

    })

}

// 创建一个Icon
function createIcon() {

    return new BMap.Icon("label.png", new BMap.Size(1, 1));
}

function createMyLabel(point, title, count) {

    var myLabel = new BMap.Label('<div style="color: white;margin-top: 28px;"><dl><dt>' + title + '</dt><dt style="margin-top: 5px"><strong>' + count + '</strong>套</dt></dl></div>', {
        offset: new BMap.Size(-60, -80),
        position: point
    });

    myLabel.setStyle({
        textShadow: "0px 0px 5px #474a4d",
        mozBorderRadius: "45px",
        webkitBorderRadius: "45px",
        borderRadius: "45px",
        fontSize: "16px", // 字号
        fontFamily: "微软雅黑", // 字号
        border: "0", // 边
        height: "90px", // 高度
        width: "90px", // 宽
        textAlign: "center", // 文字水平居中显示
        lineHeight: "13px", // 行高，文字垂直居中显示
        background: "url(img/redring.png)no-repeat",
        "background-color": "#3983c2",
        cursor: "pointer"
    });

    return myLabel;
}

function createRedLabel(title) {

    var redLabel = new BMap.Label(title, {
        "offset": new BMap.Size(15, 0)
    });

    redLabel.setStyle({
        border: '#3983c2 2px solid',
        color: "#3983c2",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: '15px',
        fontFamily: "微软雅黑",
        fontWeight: 900,
        zIndex: -10,
        "padding": "5px"
    });

    return redLabel;
}

function createGreenLabel(title, count, address) {

    var html = "";

    html += "<div class='pop-up'>";
    html += "<div class='info'>";
    html += "<h3>" + title + "</h3>";
    html += "<h4>" + address + "</h4>";
    html += "</div><div class='data'><dl>";
    html += "<dt>二手房</dt>";
    html += "<dt><strong>" + count + "</strong>套</dt></dl>";
    html += "<dl><dt>租房</dt>";
    html += "<dt><strong>33</strong>套</dt></dl>";
    html += "<dl><dt>小区详情</dt>";
    html += "<dt></dt></dl>";
    html += "</div></div>";
    html += "";

    html += "";

    var greenLabel = new BMap.Label(html, {
        "offset": new BMap.Size(15, 0)
    });

    greenLabel.setStyle({
        zIndex: -1,
        borderRadius: '5px',
        border: ''
    })
    return greenLabel;
}

function createGreenCity(title, count) {

    var greenLabel = new BMap.Label("<div class='pop-up'><div class='info'><h4>" + title + "</h4><div class='data'><dl><dt>城市</dt><dt><strong>" + title + "</strong>市</dt></dl><dl><dt>二手房</dt><dt><strong>" + count + "</strong>套</dt></dl><dl><dt>租房</dt><dt><strong>1888</strong>50</dt></dl></div></div>");
    greenLabel.setStyle({
        zIndex: -1,
        borderRadius: '5px',
        border: ''
    })
    return greenLabel;
}

function createGreenPlot(title, count) {

    var greenLabel = new BMap.Label("<div class='pop-up'><div class='info'><h4>" + title + "</h4><div class='data'><dl><dt>城区</dt><dt><strong>" + title + "</strong>区</dt></dl><dl><dt>二手房</dt><dt><strong>" + count + "</strong>套</dt></dl><dl><dt>租房</dt><dt><strong>1896</strong>套</dt></dl></div></div>");
    greenLabel.setStyle({
        zIndex: -1,
        borderRadius: '5px',
        border: ''
    })
    return greenLabel;
}

function display() {

    map.enableScrollWheelZoom();
    var b = new BMap.Bounds(new BMap.Point(116.405169, 36.841008), new BMap.Point(131.638131, 47.489826));
    try {
        BMapLib.AreaRestriction.setBounds(map, b);
    } catch (e) {
        alert(e)
    }
}

function toHome() {

    var homeBtn = $('#home');
    var backBtn = $('#back');

    homeBtn.css('display', 'block');

    homeBtn.click(function() {

        if (map.getZoom() == dataset.cityzoom) {
            console.log("已经在首页");
        } else {
            map.setZoom(dataset.initzoom);
            map.panTo(new BMap.Point(114.486351, 38.104911));
            addMarkerCity();
        }
    })
}

function goBack() {

    var backBtn = $('#back');

    backBtn.css('display', 'block');

    backBtn.click(function() {

        var zoom = map.getZoom();

        console.log(zoom);
        console.log(dataset);

        if (zoom >= dataset.villagezoom) {
            map.setZoom(dataset.properzoom);
            addMarkerPlot();
        } else if (zoom >= dataset.properzoom && zoom < dataset.villagezoom) {
            map.setZoom(dataset.initzoom);
            addMarkerCity();
        } else {
            console.log("已经在首页");
        }
    })
}

function showMarker(_marker, label) {

    _marker.setIcon(new BMap.Icon("label.png", new BMap.Size(1, 1)));
    _marker.setLabel(label);
    _marker.setTop(true)
}

function removeMarker(_marker, label) {

    map.removeOverlay(label);
    _marker.setTop(false);
}

initMap();// 创建和初始化地图
