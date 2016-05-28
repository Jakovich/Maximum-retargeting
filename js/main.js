"use strict";

$(document).ready(function() {
  
  
  //скролл наверх страницы при нажатии кнопки 
  $("#up-scroll").click(function() {
    $("body,html").animate({scrollTop:0},800);
  });
  
  //настройка сладера
  $('.carousel').carousel({

    directionNav:false,
    buttonNav:'bullets',
    autoplay: false,
    hMargin:0.21,
    frontWidth: 800,
    frontHeight: 535,
    carouselWidth: 930,
    carouselHeight: 595,
    backOpacity: 0.6,
    shadow:true
  
  });
  
   //смена картинок в зависимости от параметра
  
  var imgBig = document.querySelector(".images__big img");
  var imgLong = document.querySelector(".images__long img");
  var imgSmallFirst = document.querySelector(".images__small--first img");
  var imgSmallSecond = document.querySelector(".images__small--second img");
  var imgSmallThird = document.querySelector(".images__small--third img");
  
  var FORD = {
    "BIG": "img/ford-focus-1.jpg",
    "LONG": "img/ford-focus-3.jpg",
    "SMALL": "img/ford-focus-2.jpg"
  };
  
  var HYUNDAI = {
    "BIG": "img/hyundai-solaris-1.jpg",
    "LONG": "img/hyundai-solaris-3.jpg",
    "SMALL": "img/hyundai-solaris-2.jpg"
  };
  
  var SUZUKI = {
    "BIG": "img/suzuki-vitara-1.jpg",
    "LONG": "img/suzuki-vitara-3.jpg",
    "SMALL": "img/suzuki-vitara-2.jpg"
  };
  
  var MITSUBISHI = {
    "BIG": "img/mitsubishi-outlander-1.jpg",
    "LONG": "img/mitsubishi-outlander-3.jpg",
    "SMALL": "img/mitsubishi-outlander-2.jpg"
  };
  
  var HONDA = {
    "BIG": "img/honda-crv-1.jpg",
    "LONG": "img/honda-crv-3.jpg",
    "SMALL": "img/honda-crv-2.jpg"
  };
  
  var showImage = function(par) {
    switch(par){
      case "hyundaiLink":
        imgBig.src = HYUNDAI.BIG;
        imgLong.src = HONDA.LONG;
        imgSmallFirst.src = MITSUBISHI.SMALL;
        imgSmallSecond.src = SUZUKI.SMALL;
        imgSmallThird.src = FORD.SMALL;
        break;
        
      case "hondaLink":
        imgBig.src = HONDA.BIG;
        imgLong.src = HYUNDAI.LONG;
        imgSmallFirst.src = MITSUBISHI.SMALL;
        imgSmallSecond.src = SUZUKI.SMALL;
        imgSmallThird.src = FORD.SMALL;
        break;
        
      case "fordLink":
        imgBig.src = FORD.BIG;
        imgLong.src = SUZUKI.LONG;
        imgSmallFirst.src = MITSUBISHI.SMALL;
        imgSmallSecond.src = HYUNDAI.SMALL;
        imgSmallThird.src = HONDA.SMALL;
        break;
        
      case "suzukiLink":
        imgBig.src = SUZUKI.BIG;
        imgLong.src = MITSUBISHI.LONG;
        imgSmallFirst.src = HYUNDAI.SMALL;
        imgSmallSecond.src = FORD.SMALL;
        imgSmallThird.src = HONDA.SMALL;
        break;
        
      case "mitsubishiLink":
        imgBig.src = MITSUBISHI.BIG;
        imgLong.src = HONDA.LONG;
        imgSmallFirst.src = HYUNDAI.SMALL;
        imgSmallSecond.src = FORD.SMALL;
        imgSmallThird.src = SUZUKI.SMALL;
        break;
    }
  };
  
  showImage("mitsubishiLink");
  
});