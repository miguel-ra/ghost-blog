function disableScroll(e){
  window.scrollTo(0, 0);
}

var miguelra = (function($) {
  'use strict';

  // based on : 'Reading Position Indicator' article
  // http://css-tricks.com/reading-position-indicator/
  var _positionIndicator = function() {
    if ($('.js-post-reading-time').is(':visible')) {
      imagesLoaded('.post-body', function() {
        var getMax = function() {
          return $('.post-body').height();
        };
        var getValue = function() {
          return $(window).scrollTop();
        };
        var progressBar, max, value, width, percent;
        if ('max' in document.createElement('progress')) {
          // Browser supports progress element
          progressBar = $('progress');
          // Set the Max attr for the first time
          progressBar.attr({
            max: getMax()
          });
          $(document).on('scroll', function() {
            // On scroll only Value attr needs to be calculated
            progressBar.attr({
              value: getValue()
            });
            percent = Math.floor((getValue() / getMax()) * 100) - 5;
            if (percent < 0) {
              percent = 0;
              $('.js-post-sticky-footer').removeClass('visible');
              $('.js-post-reading-time').removeClass('visible');
              $('.js-prev-next-post').hide();
            } else if (percent > 100) {
              percent = 100;
              $('.js-post-reading-time').removeClass('visible');
              $('.js-prev-next-post').fadeIn();
            } else {
              $('.js-post-sticky-footer').addClass('visible');
              $('.js-post-reading-time').addClass('visible');
              $('.js-prev-next-post').hide();
            }
            $('.js-percent-count').text(percent + '%');
          });
          $(window).resize(function() {
            // On resize, both Max/Value attr needs to be calculated
            progressBar.attr({
              max: getMax(),
              value: getValue()
            });
          });
        } else {
          progressBar = $('.progress-bar'),
            max = getMax(),
            value, width;
          var getWidth = function() {
            // Calculate width in percentage
            value = getValue();
            width = (value / max) * 100;
            width = width + '%';
            return width;
          };
          var setWidth = function() {
            progressBar.css({
              width: getWidth()
            });
            $('.js-percent-count').text(getWidth());
          };
          $(document).on('scroll', setWidth);
          $(window).on('resize', function() {
            // Need to reset the Max attr
            max = getMax();
            setWidth();
          });
        }
      });
    }
  },

  _readingTime = function() {
    var $postArticleContent = $('.post-body');
    if ($postArticleContent.length) {
      $postArticleContent.readingTime({
        wordCountTarget: $('.js-post-reading-time').find('.js-word-count'),
        lang: 'es'
      });
    }
  },

  _post = function() {
    // Set lead paragraphs
    $('.post-body p:first-child').addClass('lead');

    // Set feature image
    var featured = $('.featured-image').find('img').attr('src');
    if (featured) {
      $('#masthead').css('backgroundImage', 'url(' + featured + ')');
      $('#footer').css('backgroundImage', 'url(' + featured + ')');
    };
  },

  // Init waypoints for header and footer animations
  _waypoints = function() {
    $('#masthead').waypoint(function(direction) {
      $(this).addClass('animation-on');
    });

    $('#main').waypoint(function(direction) {
      $('#masthead').toggleClass('animation-on');
    });

    $('#footer').waypoint(function(direction) {
      $(this).toggleClass('animation-on');
    }, {
      offset: 'bottom-in-view'
    });
  },

  _contact = function() {
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
     contactForm.addEventListener("submit", function(e) {
       e.preventDefault();
       var data = {
         "name": this.name.value,
         "email": this.email.value,
         "message": this.message.value
       };

       fetch('http://api.miguelra.com/sendmail', {
           method: 'post',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(data)
         })
         .then(function(res) {
           if (res.status >= 200 && res.status < 300) {
             swal("Mensaje enviado", "Muchas gracias por ponerte en contacto conmigo,\n contestaré lo más rápido posible.", "success");
           } else {
             swal("Oops...", "Error enviando el mensaje, puedes ponerte en contacto conmigo a través de mi correo miguel@miguelra.com", "error");
           }
         });

     });
    }
  },

  _ghostHunter = function() {
    var $body = $('body');
    var $openSearchBtn = $('.js-open-search');
    var $closeSearchBtn = $('.js-close-search');
    var $navigationSearchBtn = $('.navbar-static-top');
    var $bigSearchContainer = $('.big-search');
    // ghost hunter init
    var ghostHunter = $('.js-search-input').ghostHunter({
        results: '.js-search-results',
        result_template: '<a href="{{link}}"><p><h2>{{title}}</h2></p></a>',
        info_template   : "<p>Número de resultados: {{amount}}</p>",
        onKeyUp: true,
    });
    $openSearchBtn.on('click', function (e) {
        e.preventDefault();
        $navigationSearchBtn.addClass('open');
        $bigSearchContainer.addClass('open');
        $openSearchBtn.addClass('open');
        $bigSearchContainer.find('input[type=text]').focus();
        window.addEventListener('scroll', disableScroll);
    });
    $closeSearchBtn.on('click', function (e) {
        e.preventDefault();
        ghostHunter.clear();
        $navigationSearchBtn.removeClass('open');
        $bigSearchContainer.removeClass('open');
        $openSearchBtn.removeClass('open');
        window.removeEventListener('scroll', disableScroll);
    });
  };

  return {
    init: function() {
      _positionIndicator();
      _readingTime();
      _post();
      _waypoints();
      _contact();
      _ghostHunter();
    }
  };

})(jQuery);


(function() {
  'use strict';
  miguelra.init();
})();
