var Map = {};
Map.Point = function (data) {
    this.id = data.id;
    this.lat = data.lat;
    this.lng = data.lng;
    this.zoom = data.zoom;
    this.name = data.name;
    this.address = data.address;
    this.phones = data.phones;
    this.emails = data.emails;
    this.pos = data.pos;
    this.imageURL = data.imageURL;
    this.html = data.html;
    this.htmlOver = data.htmlOver;
    this.clusterId = data.clusterId;
    this.withLayer = data.withLayer;
    this.filter = data.filter;
    this.pointZoom = data.pointZoom;
    this.onDrag = data.onDrag;
    this.mapObject = null;
    this.mapLayer = null;
}
Map.Area = function (data) {
    this.id = data.id;
    this.name = data.name;
    this.coords = data.coords;
    this.htmlOver = data.htmlOver;
    this.html = data.html;
    this.htmlZoom = data.htmlZoom;
    this.htmlFull = data.htmlFull;
    this.fillColor = data.fillColor;
    this.strokeColor = data.strokeColor;
    this.opacity = data.opacity;
    this.opacityOver = data.opacityOver;
    this.url = data.url;
    this.params = data.params;
    this.onClick = data.onClick;
    this.mapObject = null;
    this.mapObject2 = null;
}

Map.DEFAULT_LNG = 30.34;
Map.DEFAULT_LAT = 59.93;
Map.DEFAULT_ZOOM = 10;

Map.divId = null;
Map.lng = null;
Map.lat = null;
Map.zoom = null;
Map.minZoom=0;

Map.currentMapObject = null;
Map.map = null;
Map.points = null;
Map.filter = null;
Map.areas = {};
Map.globalLayer=null;
Map.globalLayer2=null;
Map.onBoundsChange = null;
Map.withScrollZoom=false;
Map.noPointZoom=true;
Map.withGlobalLayer=false;
Map.withCluster=false;

Map.getPointsByAddress=function(){

	var addDoms=$('.addressOnMap');
	Map.points=Array();
	addDoms.each(function(){
		var adr=$(this).text();

		var geocoder=ymaps.geocode(adr,{results:1});
		var coords=null;
		geocoder.then(function(res) {
				if(!res.geoObjects.getLength()) {
					alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
					return;
				}

				var point=res.geoObjects.get(0);
				coords=point.geometry.getCoordinates();
				var data={};
				data.address=adr;
				data.lat=coords[0];
				data.lng=coords[1];
				Map.points.push(data);
//				console.log(Map.points);
//			console.log(Map.points);
//			console.log(coords);
//			console.log('infunction');
//			return coords;
//
//			// update inputs:
//			get("sourceLat").value=coords[0];
//			get("sourceLng").value=coords[1];
//			get("sourceZoom").value=map.getZoom();
//			input.setAttribute("preventSubmit","");
			}
			,function(error){
				alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
				input.setAttribute("preventSubmit","");
			});
	});

//	console.log(Map.points);
//	console.log('here');
}

Map.init = function () {
    var mapEl = $("#" + Map.divId ? Map.divId : "map");
    if (!mapEl)return;

    mapEl.innerHTML = "";

    //Event.off(this, "resize", Map.onWResize);
    //Event.on(this, "resize", Map.onWResize);

    var countPoints = 0;

    if (Map.points != null) {
        for (var key in Map.points) {
            var item = Map.points[key];
            countPoints++;
        }
    }
	else {
	    Map.getPointsByAddress();
	    console.log(Map.points);
	    for (var key in Map.points) {
		    var item = Map.points[key];
		    countPoints++;
	    }
    }
//	return;

    if (Map.map)Map.map.destroy();

    if (countPoints > 0) {
        Map.map = new ymaps.Map(Map.divId ? Map.divId : "map", {
                center: [Map.lat ? Map.lat : Map.DEFAULT_LAT, Map.lng ? Map.lng : Map.DEFAULT_LNG],
                zoom: Map.zoom ? Map.zoom : Map.DEFAULT_ZOOM
            },{
                minZoom:Map.minZoom
            }
        );

        //var collection = new ymaps.GeoObjectCollection({});
        Map.addPoints(Map.zoom ? false : true);

        Map.map.events.add("boundschange", function (e) {
            if (Map.onBoundsChange != null)Map.onBoundsChange(e);
            //return;
            Map.setPointsVisibilityByZoom();
        });
    }
    else {
        Map.map = new ymaps.Map(Map.divId ? Map.divId : "map", {
                center: [Map.DEFAULT_LAT, Map.DEFAULT_LNG],
                zoom: Map.DEFAULT_ZOOM
            }
        );
    }

    if(Map.withScrollZoom)Map.map.behaviors.enable('scrollZoom');
    Map.map.controls.add("zoomControl");

    // выводим участки:
    for (var key in Map.areas) {
        var a = Map.areas[key];
        if(!a.coords)continue;
        var p = new ymaps.Polygon([a.coords], {
            hintContent: a.htmlOver,
            hintZIndex:10,
            areaData:a
        }, {
            fillColor: a.fillColor,
            strokeColor: a.strokeColor,
            strokeWidth: 0,
            opacity:a.opacity,
            strokeOpacity:0
            //fillImageHref:Map.fill(a),
            //fillMethod:'tile'
        });
        a.mapObject=p;

        p.events
            .add('mouseenter', function (e) {
                var p = e.get('target');
                var a=p.properties.get("areaData");
                p.options.set('opacity', a.opacityOver);
            })
            .add('mouseleave', function (e) {
                var p = e.get('target');
                var a=p.properties.get("areaData");
                p.options.set('opacity', a.opacity);
            });
        if(a.url){
            p.events
                .add('click', function (e) {
                    var p = e.get('target');
                    var a=p.properties.get("areaData");
                    self.location.href= a.url;
                })
        }
        if(a.onClick){
            p.events
                .add('click', function (e) {
                    var p = e.get('target');
                    var a=p.properties.get("areaData");
                    //p.hint.close();
                    a.onClick(a);
                    //p.hint.close();
                })
        }

        Map.map.geoObjects.add(p);

        var cc=Map.avgCoords(a.coords, p);

        //var myIconContentLayout = ymaps.templateLayoutFactory.createClass('<div class="number">{{properties.prop1}}</div>');
        var pp = new ymaps.Placemark(cc,{
            prop1: a.id,
            iconContent: a.html,
            hintContent: a.htmlOver,
            areaData:a
        }, {
            hasHint:true,
            hasBaloon:false,
            /*iconLayout: myIconContentLayout,
            // Описываем фигуру активной области
            // "Прямоугольник".
            iconShape: {
                type: 'Rectangle',
                // Прямоугольник описывается в виде двух
                // точек - верхней левой и нижней правой.
                coordinates: [
                    [-25, -25], [25, 25]
                ]
            }/*,*/
            iconImageHref: '/i/HomePage.map-point.gif', // e.gif',//Map.numberBG.png',
            iconImageSize: [30, 30], // размеры картинки
            iconImageOffset: [-15, -15] // смещение картинки*/
        });
        Map.map.geoObjects.add(pp);
        a.mapObject2=pp;

        pp.events
            .add('mouseenter', function (e) {
                var pp = e.get('target');
                var a=pp.properties.get("areaData");
                var p=a.mapObject;
                p.options.set('opacity', a.opacityOver);
            })
            .add('mouseleave', function (e) {
                var pp = e.get('target');
                var a=pp.properties.get("areaData");
                var p=a.mapObject;
                p.options.set('opacity', a.opacity);
            });

        if(a.url){
            pp.events
                .add('click', function (e) {
                    var p = e.get('target');
                    var a=p.properties.get("areaData");
                    self.location.href= a.url;
                })
        }
        if(a.onClick){
            pp.events
                .add('click', function (e) {
                    var p = e.get('target');
                    var a=p.properties.get("areaData");
                    //p.hint.close();
                    a.onClick(a);
                })
        }
    }
}
Map.avgCoords=function(coords, poly){
 /*   var pixelBounds = polygon.geometry.getPixelGeometry().getBounds();
    var pixelCenter = [pixelBounds[0][0] + (pixelBounds[1][0] - pixelBounds[0][0]) / 2, (pixelBounds[1][1] - pixelBounds[0][1]) / 2 + pixelBounds[0][1]];
    var geoCenter = Map.map.options.get('projection').fromGlobalPixels(pixelCenter, Map.map.getZoom());
    return geoCenter;*/


    var cc=[0,0];
    var coords = poly.geometry.getPixelGeometry().getBounds();
    for(var i=0;i<coords.length;i++){
        cc[0]+= coords[i][0];
        cc[1]+= coords[i][1];
    }
    cc[0]=cc[0]/coords.length;
    cc[1]=cc[1]/coords.length;
    var geoCenter = Map.map.options.get('projection').fromGlobalPixels(cc, Map.map.getZoom());
    return geoCenter;

    //var coords=polygon.geometry.coordinates;
    for(var i=0;i<coords.length;i++){
        cc[0]+= coords[i][0];
        cc[1]+= coords[i][1];
    }
    cc[0]=cc[0]/coords.length;
    cc[1]=cc[1]/coords.length;
    return cc;
}
/*Map.fill=function(a){
    var canvas = document.createElement('canvas');
    //document.body.appendChild(canvas);
    if (canvas && canvas.getContext) {
        var c = canvas.getContext('2d');
        var centerX = 20; // Координата центра круга по оси X
        var centerY = 20; // Координата центра круга по оси Y
        var radius = 20; // Радиус окружности
        var startingAngle = 0 * Math.PI; // Начальная точка окружности
        var endingAngle = 2 * Math.PI;  // Конечная точка окружности
        var counterclockwise = false;

        c.arc(centerX, centerY, radius, startingAngle,
            endingAngle, counterclockwise);
        c.lineWidth = 2; // Толщина обводки (границы) окружности
        c.strokeStyle = '#1d74cf'; // Цвет обводки (границы) окружности
        c.fillStyle = '#ffffff'; // Цвет заливки окружности
        c.fill();
        c.stroke();

        c.fillStyle = "blue";
        c.font = "bold 8px Arial";
        c.fillText("12", 20, 20);
    }

    return canvas.toDataURL();
}*/
Map.setPointsVisibilityByZoom = function () {
    if(Map.noPointZoom)return;
    var z = Map.map.getZoom();
    for (var key in Map.points) {
        var a = Map.points[key];

        if (a.withLayer && a.pointZoom) {
            if (z > a.pointZoom) {
                a.mapObject.options.set('visible', false);
            }
            else {
                a.mapObject.balloon.close();
                a.mapObject.options.set('visible', true);
            }
        }
    }

    for (var key in Map.areas) {
        var a = Map.areas[key];
        if (!a.coords)continue;

        if (a.htmlZoom&&a.mapObject) {
            //console.log(z+":"+a.htmlZoom);
            if ( z < a.htmlZoom) {
                a.mapObject.options.set('visible', false);
                a.mapObject2.options.set('visible', false);
            }
            else {
                a.mapObject.options.set('visible', true);
                a.mapObject2.options.set('visible', true);
            }
        }
    }
}
Map.addPoints = function (withFit) {
    if ( Map.withCluster && !Map.filter ) {
        // check how many clusters we need:
        Map.clusters = {};
        for (var key in Map.points) {
            var a = Map.points[key];
            if(a.clusterId){
                if(typeof(Map.clusters['cluster'+a.clusterId])=="undefined"){
                    var layout = ymaps.templateLayoutFactory.createClass(
                        '<div></div>');

                    var cluster = new ymaps.Clusterer({
                        //preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false,
                        //clusterDisableClickZoom: true,
                        //clusterHideIconOnBalloonOpen: false,
                        //geoObjectHideIconOnBalloonOpen: false,
                        gridSize: 610,
                        //hasBalloon:true,
                        //hasHint:false,
                        maxZoom:10,
                        margin:0,
                        zoomMargin:50,
                        //clusterNumbers: [100],
                        clusterIconContentLayout: layout,
                        //clusterOpenBalloonOnClick:true,
                        clusterIcons: [{
                            href: '/i/Map.cluster'+ a.clusterId+'.png',
                            size: [150, 150],
                            offset: [-75, -75]
                        }]
                    });
                    Map.clusters['cluster'+a.clusterId]= cluster;
                }
            }
        }
    }

    var i = 0;
    for (var key in Map.points) {
        var a = Map.points[key];

        var p=Map.addPoint(a);

        if ( Map.withCluster && !Map.filter ) {
            var cluster = Map.clusters["cluster"+a.clusterId];
            cluster.add(p);
        }

        i++;
    }

    if ( Map.withCluster && !Map.filter ) {
        for (var key in Map.clusters) {
            var cluster = Map.clusters[key];
            Map.map.geoObjects.add(cluster);
        }
    }

    Map.addGlobalLayer();

    if (i > 1 && withFit){
        Map.fit();
    }
    else if ( i==1 ) {
        Map.zoomToPoint(a.id, a.zoom, true);
    }
    Map.setPointsVisibilityByZoom();
}
Map.addGlobalLayer=function(){
    if (Map.withGlobalLayer) {

        Map.globalLayer = new ymaps.Layer(
            '/maps/global/%z/tile-%x-%y.png', {
                tileTransparent: true
            });
        Map.map.layers.add(Map.globalLayer);
    }
}
Map.fit = function () {
    var zoom = Map.map.getZoom();
    if ( Map.withCluster && !Map.filter ) {
        // check zoom
        var bounds=[];
        for (var key in Map.clusters) {
            var cluster = Map.clusters[key];
            var b=cluster.getBounds();

            if ( !bounds[0]) {
                bounds[0]=b[0];
                bounds[1]=b[1];
            }
            bounds[0]=[Math.min(bounds[0][0],b[0][0]), Math.min(bounds[0][1],b[0][1])];
            bounds[1]=[Math.max(bounds[1][0],b[1][0]), Math.max(bounds[1][1],b[1][1])];
        }
        //alert(Map.map.geoObjects.getBounds());
    }
    else bounds = Map.map.geoObjects.getBounds();
    Map.map.setBounds(bounds);
    if (zoom > 17){
        zoom = 17;
        Map.map.setZoom(zoom);
    }
}
Map.coordByAddress=function(adresses){
//	var input=get("sourceAddress");
//	if ( !input.value ) return;
//
//	var a=input.value;
//	var ci=get('city').selectedIndex;
//	var c=get('city').options[ci].text;
//	var a=c+", "+a;
//
//	var map=AdminSourcesEdit.map;
//
//	input.setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");
	var a=adresses;
//	console.log(ymaps);
	var geocoder=ymaps.geocode(a,{results:1});
	var coords=null;
	geocoder.then(function(res) {
			if(!res.geoObjects.getLength()) {
				alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
				return;
			}

			var point=res.geoObjects.get(0);
			coords=point.geometry.getCoordinates();
//			console.log(coords);
//			console.log('infunction');
//			return coords;
//
//			// update inputs:
//			get("sourceLat").value=coords[0];
//			get("sourceLng").value=coords[1];
//			get("sourceZoom").value=map.getZoom();
//			input.setAttribute("preventSubmit","");
		}
		,function(error){
			alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
			input.setAttribute("preventSubmit","");
		});
}
Map.addPoint = function (a) {
    if (!a.noPoint){
        if (a.mapObject) {
            Map.map.geoObjects.remove(a.mapObject);
        }

        /*if(Map.filter && a.filter && $.inArray(Map.filter, a.filter) == -1) {
            if (a.pos) var icon = "/i/Map.pointGray" + a.pos + ".png";
            else var icon = "/i/Map.pointSmall.png";
            var iconSize=[15, 20];
            var iconOffset=[-7, -20];
        }
        else {
            if (a.pos) var icon = "/i/Map.point2_" + a.pos + ".png";
            else var icon = "/i/Map.point2.png";
            var iconSize=[30, 39];
            var iconOffset=[-15, -39];
        }*/

        var icon = "../img/HomePage.map-point.png";
        var iconSize=[96, 119];
        var iconOffset=[-47, -119];

        var p = new ymaps.Placemark([a.lat, a.lng], {
            balloonContent: a.html,
            pointData: a,
            hintContent: a.htmlOver,
            clusterCaption: a.name

        }, {
            iconImageHref: icon,
            //iconImageHref: "/i/Map.point2.png",
            iconImageSize: iconSize,
            iconImageOffset: iconOffset,
            draggable: a.onDrag ? true : false
        });
        a.mapObject = p;

        if (a.onDrag) {
            p.events.add("dragend", function (e) {
                var p = e.get('target');
                var a = p.properties.get('pointData');
                a.onDrag(a, p, e);
            });
        }
        else {
            p.events.add('click', function (e) {
                Map.currentMapObject = e.get('target');
				
                var b = e.get('target');
                var a = b.properties.get('pointData');
				//console.log(a);
                Map.zoomToPoint(a.id, a.zoom, false);
            });
            p.events
                .add('mouseenter', function (e) {
                    var b = e.get('target');
                    //b.options.set('iconImageHref', '/i/Map.point2_'+b.properties.get('pointData').pos+'_.png');
                })
                .add('mouseleave', function (e) {
                    e.get('target').options.unset('preset');
                });
            p.events.add('balloonopen', function (e) {
                var b = e.get('target');
                var p = Map.currentMapObject;
                var pointId = p.properties.get("pointId");
                var point = Map.points["point" + pointId];
            });
            p.events.add('balloonclose', function (e) {
                var b = e.get('target');
                var p = Map.currentMapObject;
                var pointId = p.properties.get("pointId");
                var point = Map.points["point" + pointId];
            });
        }

        //collection.add(p);
        if ( !Map.withCluster || Map.filter ) Map.map.geoObjects.add(p);
    }

    if (a.withLayer&&!Map.withGlobalLayer) {
        if (!a.mapLayer)a.mapLayer = new ymaps.Layer(
            '/maps/' + a.id + '/%z/tile-%x-%y.png', {
                tileTransparent: true
            });
        Map.map.layers.add(a.mapLayer);
    }
    return p;
}
Map.clear = function () {
    for (var key in Map.clusters) {
        var a = Map.clusters[key];
        Map.map.geoObjects.remove(a);
    }
    for (var key in Map.points) {
        var a = Map.points[key];
        if (a.mapObject)Map.map.geoObjects.remove(a.mapObject);
        if (a.mapLayer) Map.map.layers.remove(a.mapLayer);
    }
    if(Map.globalLayer) Map.map.layers.remove(Map.globalLayer);
    if(Map.globalLayer2) Map.map.layers.remove(Map.globalLayer2);
}
Map.resetFilter = function () {
    Map.filter=null;
    Map.clear();
    Map.addPoints();
}
Map.applyFilter = function (filter) {
    Map.filter=filter;
    Map.clear();
/*    for (var key in Map.points) {
        var a = Map.points[key];
        if (filter && a.filter && $.inArray(filter, a.filter) == -1)continue;
        // get this out:
        Map.addPoint(a);
        //Map.map.geoObjects.add(a.mapObject);
        //Map.map.geoObjects.remove(a.mapObject);
        //Map.map.layers.remove(a.mapLayer);
    }*/
    //Map.addGlobalLayer();
    //Map.fit();
    Map.addPoints(true);
}
Map.zoomToPoint = function (id, zoom, noBaloon) {
   // console.log(id);
	var a = Map.points[id];
    if (!zoom)zoom = a.zoom;
    // center map:
    Map.map.setCenter([a.lat, a.lng], zoom);
    Map.currentMapObject = a.mapObject;
    if (!noBaloon){
        setTimeout(function(){
            a.mapObject.balloon.open();
        },250);
    }
    //alert(a.mapObject+":"+ a.id);
    //a.mapObject.balloon.open();
}
Map.firstPoint = function () {
    for (var key in Map.points) {
        return Map.points[key];
    }
}
Map.movePointToAddress = function (a, address) {
    //input.setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");

    var geocoder = ymaps.geocode(address, {results: 1});
    geocoder.then(function (res) {
        if (!res.geoObjects.getLength()) {
            alert("К сожалению введенный адрес не распознан:\n" + address + "\nПожалуйста, укажите позицию на карте вручную.");
            return;
        }

        var point = res.geoObjects.get(0);
        var coords = point.geometry.getCoordinates();

        a.lat = coords[0];
        a.lng = coords[1];
        Map.addPoint(a);
        Map.zoomToPoint(a.id, 14, true);
        if (a.onDrag)a.onDrag(a, a.mapObject);

        // update inputs:
        /*$('#sourceLat')[0].value=coords[0];
         $('#sourceLng')[0].value=coords[1];
         $('#sourceZoom')[0].value=map.getZoom();
         input.setAttribute("preventSubmit","");*/
    }, function (error) {
        alert("К сожалению введенный адрес не распознан:\n" + address + "\nПожалуйста, укажите позицию на карте вручную.");
        //input.setAttribute("preventSubmit","");
    });
}
Map.startEditingRegions = function () {
    var div = $("#" + Map.divId ? Map.divId : "map");
    div.animate({
        "left": 0,
        "top": 0,
        "position": "absolute",
        "width": "100%",
        "height": "100%",
        "z-index": 10
    });
}
Map.fullscreenParent=null;
Map.fullscreen=function(){
    var c=$('#mapContainer');
    c.addClass('fullscreen');
    Map.fullscreenParent = c.parent();
    $("body").append(c);

    //setTimeout("Map.map.container.fitToViewport();",500);
    Map.map.container.fitToViewport();
    //Map.fit();
}
Map.smallscreen=function(){
    var c=$('#mapContainer');
    c.removeClass('fullscreen');
    Map.fullscreenParent.prepend(c);

    Map.map.container.fitToViewport();
}

if (typeof ymaps != "undefined")ymaps.ready(Map.init);
//onReadys.push(Firm.init);

