function initialize() {
    $('#prompt').on('click', nextSlide);
    $('.slide').on('click', nextSlide);
    $('#skip').on('click', goToTool);
    $('#imageInput').change(readURL);

    $("#slider").slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 4000,
      value: 40000,
      slide: sliderMoved
    });
    $("#size").text($("#slider").slider("value"));

    $('.slide').each(function() {
        _slides[_slides.length] = $(this).prop('id');
    });

    for (let i = 1; i < _slides.length; i++) {
        $('#' + _slides[i]).hide();
    }

    startPromptTimer();
}

function sliderMoved() {
    let slider = $("#slider");
    $("#size").text(slider.get(0).value);
    let thumb = slider.children('.ui-slider-handle');
    let position = $('#sliderContainer').position().top + thumb.position().top;
    position = position + 10;
    $('#sliderLine').css('top', position);
    $('#size').css('top', position);
}

var _slides = [];
var _currentSlide = 0;

function nextSlide() {
    if (_currentSlide < _slides.length - 1) {
        let slide = _slides[_currentSlide];
        $('#' + slide).hide();
        _currentSlide++;
        slide = _slides[_currentSlide];
        $('#' + slide).show();
        startPromptTimer();
    } else {
        goToTool();
    }
}

function goToTool() {
    for (let i = 0; i < _slides.length; i++) {
        $('#' + _slides[i]).hide();
    }
    _currentSlide = _slides.length;
    cancelPromptTimer();
    $('#selectImage').show();
    $('#skip').hide();
}

var _promptTimer = null;
function cancelPromptTimer() {
    if (_promptTimer != null) {
        clearTimeout(_promptTimer);
    }
    $('#prompt').hide();
}

function startPromptTimer() {
    cancelPromptTimer();
    _promptTimer = setTimeout(function() {
        $('#prompt').fadeIn(500);
        _promptTimer = null;
    }, 5000);
}

function readURL() {
    if (this.files && this.files[0]) {
        let reader = new FileReader();
        $('#userImage').load(screenshotReady);
        $(reader).load(function(e) {
            $('#userImage').attr('src', e.target.result);
        });
        reader.readAsDataURL(this.files[0]);
        $('#selectImage').hide();
        $('#alignImage').show();
    }
}

function screenshotReady() {
    $('#userImage').resizable({
        aspectRatio: true,
        handles: 'n, e, s, w, ne, se, sw, nw'
    });
    $('#screenshot').draggable();
    $('#screenshot').css('left', $('#lantern').position().left - 300);

    resize($('#userImage'), 600, 600 / $('#userImage').width() * $('#userImage').height());
    sliderMoved();
}

function resize(target, new_width, new_height){
    let $wrapper = $(target).resizable('widget'),
        $element = $wrapper.find('.ui-resizable'),
        dx = $element.width()  - new_width,
        dy = $element.height() - new_height;

    $element.width( new_width );
    $wrapper.width( $wrapper.width() - dx );
    $element.height( new_height );
    $wrapper.height( $wrapper.height() - dy );
}


$(document).ready(initialize);