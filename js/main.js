"use strict";

$(document).ready(function() {


  //скролл наверх страницы при нажатии кнопки
  $("#up-scroll").click(function() {
    $("body,html").animate({scrollTop:0},800);
  });

  //настройка сладера
  $(".carousel").carousel({

    directionNav: false,
    buttonNav: "bullets",
    autoplay: false,
    hMargin: 0.21,
    frontWidth: 700,
    frontHeight: 465,
    carouselWidth: 925,
    carouselHeight: 500,
    backOpacity: 0.6,
    shadow: true

  });

   //смена картинок в зависимости от параметра

  var imgBig = document.querySelector(".images__big img");
  var imgLong = document.querySelector(".images__long img");
  var imgSmallFirst = document.querySelector(".images__small--first img");
  var imgSmallSecond = document.querySelector(".images__small--second img");
  var imgSmallThird = document.querySelector(".images__small--third img");

  function parseGetParams() {
    var $_GET = {};
    var __GET = window.location.search.substring(1).split("&")
    if(__GET[0] == "") return false;
    for(var i=0; i<__GET.length; i++) {
      var getVar = __GET[i].split("=");
      $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
    }
    return $_GET;
  }

  var GETArr = parseGetParams();

  var currentMark = GETArr.mark;



  //задаем адреса картинок по маркам и размерам
  var FORD = {
    "BIG": "i/ford-focus-1.jpg",
    "LONG": "i/ford-focus-3.jpg",
    "SMALL": "i/ford-focus-2.jpg"
  };

  var HYUNDAI = {
    "BIG": "i/hyundai-solaris-1.jpg",
    "LONG": "i/hyundai-solaris-3.jpg",
    "SMALL": "i/hyundai-solaris-2.jpg"
  };

  var SUZUKI = {
    "BIG": "i/suzuki-vitara-1.jpg",
    "LONG": "i/suzuki-vitara-3.jpg",
    "SMALL": "i/suzuki-vitara-2.jpg"
  };

  var MITSUBISHI = {
    "BIG": "i/mitsubishi-outlander-1.jpg",
    "LONG": "i/mitsubishi-outlander-3.jpg",
    "SMALL": "i/mitsubishi-outlander-2.jpg"
  };

  var HONDA = {
    "BIG": "i/honda-crv-1.jpg",
    "LONG": "i/honda-crv-3.jpg",
    "SMALL": "i/honda-crv-2.jpg"
  };

  //функция установки адресов картинок
  var setSrc = function(carBig, carLong, carSmallFirst, carSmallSecond, carSmallThird) {
    imgBig.src = carBig.BIG;
    imgLong.src = carLong.LONG;
    imgSmallFirst.src = carSmallFirst.SMALL;
    imgSmallSecond.src = carSmallSecond.SMALL;
    imgSmallThird.src = carSmallThird.SMALL;
  };

  //функция показа картинок в заисимости от параметра
  var showImage = function(par) {
    switch(par){
      case "hyundai":
        setSrc(HYUNDAI, HONDA, MITSUBISHI, SUZUKI, FORD);
        break;

      case "honda":
        setSrc(HONDA, FORD, MITSUBISHI, SUZUKI, HYUNDAI);
        break;

      case "ford":
        setSrc(FORD, HYUNDAI, HONDA, MITSUBISHI, SUZUKI);
        break;

      case "suzuki":
        setSrc(SUZUKI, HYUNDAI, HONDA, MITSUBISHI, FORD);
        break;

      case "mitsubishi":
        setSrc(MITSUBISHI, FORD, HYUNDAI, HONDA, SUZUKI);
        break;
    }
  };

  showImage(currentMark);



});

  function switchAddr(id, th) {
    $('#dop-block #addr .data').each(function(){
        if($(this).attr('id') == 'data-'+id) $(this).show();
        else $(this).hide();
    });

    $('#dop-block .switch').each(function(){
        if($(this).get(0) == $(th).get(0)) $(th).addClass('active');
        else $(this).removeClass('active');
    });
}
