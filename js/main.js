"use strict";

$(document).ready(function() {
  
  
  //скролл наверх страницы при нажатии кнопки 
  $("#up-scroll").click(function() {

    $("body,html").animate({scrollTop:0},800);

  });
  
  //настройка сладера
  $('.carousel').carousel({
 
    directionNav:false,
    shadow:false,
    buttonNav:'bullets',
    autoplay: false,
    hMargin:0.1,
    frontWidth: 800,
    frontHeight: 535,
    carouselWidth: 900,
    carouselHeight: 595,
    backOpacity: 0.8
  
  });
  
});