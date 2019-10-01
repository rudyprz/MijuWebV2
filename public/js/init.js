$(document).ready(function(){
  $('.modal').modal();
  $('.parallax').parallax();
  $('.tabs').tabs();
  $(".dropdown-trigger").dropdown();
  //Open nav menu
  $('#nav-trigger').on('click', function(){
    $('#navbar').addClass('hide');
    $('#backToTop').addClass('hide');
    $('#nav').animate({top: '0'});
    //Disable page scrolling
    $('html, body').addClass('no-scroll');
  });
  //Open nav menu
  $('#close-nav').on('click', function(){
    $('#navbar').removeClass('hide');
    $('#backToTop').removeClass('hide');
    $('#nav').animate({top: '-100vh'});
    //Enable scrolling again
    $('html, body').removeClass('no-scroll');
  });
  //Init components
  $('.fixed-action-btn').floatingActionButton();
  //Datepicker
  $('.datepicker').datepicker({
    yearRange: [1950,2019],
    format: 'dd-mm-yyyy',
    i18n: {
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
      weekdays: ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      weekdaysShort: ["Dom","Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      weekdaysAbbrev: ["D","L", "M", "M", "J", "V", "S"]
    }
  });
  //Selectors
  $('select').formSelect();
  //Back to top function
  $('#backToTop').on('click', function(){
    $('html,body').animate({ scrollTop: 0 }, 'slow');
        return false;
  });
});