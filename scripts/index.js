$(function() {

  var isMobile;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
   isMobile = true;

   // Mobile height fix
   $('.height-fix').each(function(){
    var h = $(this).height();
    $(this).height(h)
   })
  }

  // RESIZE RESETS
  $(window).resize(function(){
    posFilterBar($('.filter').first());
  });

  // Sticky Nav on Mobile
  if (isMobile) {
    $('nav').addClass('fixed');
  } else {
    $('nav').addClass('desk');
  }


  // NAV POSITION
  var navPos = $('nav').position().top;
  var lastPos = 0;
  var lockTimer

  $(window).on('scroll', function () {

    var pos = $(window).scrollTop();
    var pos2 = pos + 50;
    var scrollBottom = pos + $(window).height();

    if (!isMobile) {
      if (pos >= navPos + $('nav').height() && lastPos < pos) {
        $('nav').addClass('fixed');
      }
      if (pos < navPos && lastPos > pos) {
        $('nav').removeClass('fixed');
      }
      lastPos = pos;
    }

    // Link Highlighting
    if (pos2 > $('#home').offset().top)       { highlightLink('home'); }
    if (pos2 > $('#about').offset().top)      { highlightLink('about'); }
    if (pos2 > $('#portfolio').offset().top)  { highlightLink('portfolio'); }
    if (pos2 > $('#blog').offset().top)       { highlightLink('blog'); }
    if (pos2 > $('#contact').offset().top ||
        pos + $(window).height() === $(document).height()) {
          highlightLink('contact');
    }

    // Prevent Hover on Scroll
    clearTimeout(lockTimer);
    if(!$('body').hasClass('disable-hover')) {
      $('body').addClass('disable-hover')
    }

    lockTimer = setTimeout(function(){
      $('body').removeClass('disable-hover')
    }, 500);
  });

  function highlightLink(anchor) {
    $('nav .active').removeClass('active');
    $("nav").find('[dest="' + anchor + '"]').addClass('active');
  }


  // EVENT HANDLERS
  $('.page-link').click(function() {
    var anchor = $(this).attr("dest");
    $('.link-wrap').removeClass('visible');

    $('nav span').removeClass('active');
    $("nav").find('[dest="'+ anchor +'"]').addClass('active');

    $('html, body').animate({
      scrollTop: $('#' + anchor).offset().top
    }, 400);
  });

  $('.mdi-menu').click(function() {
    $('.link-wrap').toggleClass('visible');
  });

  $('.blog-wrap').hover(  function() {
    $('.blog-wrap').not(this).addClass('fade');
    $( this ).addClass( "hover" );
  }, function() {
    $( this ).removeClass( "hover" );
    $('.blog-wrap').removeClass('fade');
  });

  posFilterBar($('.filter').first());

  $('.filter').click(function(){
    posFilterBar(this);
  });

  function posFilterBar(elem) {
    var origin = $(elem).parent().offset().left;
    var pos = $(elem).offset().left;
    $('.float-bar').css({
      left: pos - origin,
      width: $(elem).innerWidth()
    });
    $('.float-bar .row').css('left', (pos - origin) * -1);
  }

  // GALLERY
  $('#gallery').mixItUp({ });

  function mixClear() {
    setTimeout(function() { $('#gallery').removeClass('waypoint') }, 2000);
  }

  // SCROLL ANIMATIONS
  function onScrollInit( items, elemTrigger ) {
    var offset = $(window).height() / 1.6
    items.each( function() {
      var elem = $(this),
          animationClass = elem.attr('data-animation'),
          animationDelay = elem.attr('data-delay');

          elem.css({
            '-webkit-animation-delay':  animationDelay,
            '-moz-animation-delay':     animationDelay,
            'animation-delay':          animationDelay
          });

          var trigger = (elemTrigger) ? trigger : elem;

          trigger.waypoint(function() {
            elem.addClass('animated').addClass(animationClass);
            if (elem.get(0).id === 'gallery') mixClear(); //OPTIONAL
            },{
                triggerOnce: true,
                offset: offset
          });
    });
  }

  setTimeout(function() { onScrollInit($('.waypoint')) }, 10);

  // CONTACT FORM
  $('#contact-form').submit(function(e) {
    e.preventDefault();

      $.ajax({
          url: "https://formspree.io/gautam.jain9@yahoo.com",
          method: "POST",
          data: { message: $('form').serialize() },
          dataType: "json"
      }).done(function(response) {
          $('#success').addClass('expand');
          $('#contact-form').find("input[type=text], input[type=email], textarea").val("");
      });
  });

  $('#close').click(function() {
    $('#success').removeClass('expand');
  })

});

//smoth scroll on clicks

// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      //if (confirm('A new version of this app is available. Load it?')) {
        window.location.reload();
      //}
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);


//smooth scroll on mouse

// Math.easeOutQuad = function (t, b, c, d) { t /= d; return -c * t*(t-2) + b; };
//
// (function() { // do not mess global space
// var
//   interval, // scroll is being eased
//   mult = 0, // how fast do we scroll
//   dir = 0, // 1 = scroll down, -1 = scroll up
//   steps = 50, // how many steps in animation
//   length = 30; // how long to animate
// function MouseWheelHandler(e) {
//   e.preventDefault(); // prevent default browser scroll
//   clearInterval(interval); // cancel previous animation
//   ++mult; // we are going to scroll faster
//   var delta = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); // cross-browser
//   if(dir!=delta) { // scroll direction changed
//     mult = 1; // start slowly
//     dir = delta;
//   }
//   // in this cycle, we determine which element to scroll
//   for(var tgt=e.target; tgt!=document.documentElement; tgt=tgt.parentNode) {
//     var oldScroll = tgt.scrollTop;
//     tgt.scrollTop+= delta;
//     if(oldScroll!=tgt.scrollTop) break;
//     // else the element can't be scrolled, try its parent in next iteration
//   }
//   var start = tgt.scrollTop;
//   var end = start + length*mult*delta; // where to end the scroll
//   var change = end - start; // base change in one step
//   var step = 0; // current step
//   interval = setInterval(function() {
//     var pos = Math.easeOutQuad(step++,start,change,steps); // calculate next step
//     tgt.scrollTop = pos; // scroll the target to next step
//     if(step>=steps) { // scroll finished without speed up - stop animation
//       mult = 0; // next scroll will start slowly
//       clearInterval(interval);
//     }
//   },10);
// }
//
// // nonstandard: Chrome, IE, Opera, Safari
// window.addEventListener("mousewheel", MouseWheelHandler, false);
// // nonstandard: Firefox
// window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
// })();
