function initialize() {
    $('#prompt').on('click', nextSlide);
    $('.slideImage').on('click', nextSlide);
    $('#next').on('click', nextSlide);
    $('#previous').on('click', previousSlide);
    $('#skip').on('click', goToTool);
    $('#imageInput').change(readURL);
    $('#uploadButton').button().on('click', uploadFile);
    $('#showHuge').button().on('click', toggleHuge);
    $('#showTiny').button().on('click', toggleTiny);
    $('#showTallest').button().on('click', toggleTallest);
    $('#showSmallest').button().on('click', toggleSmallest);
    $('#showChild').button().on('click', toggleChild);
    $('#showGrow').button().on('click', toggleGrow);
    $('#showShrink').button().on('click', toggleShrink);
    $('#showOfficial').button().on('click', toggleOfficial);
    $('#showScreenshot').button().on('click', toggleScreenshot);

    $("#slider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 4000,
        value: 4000,
        slide: sliderMoved,
        stop: sliderMoved
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

function sliderMoved(event, ui) {
    let slider = $("#slider");
    let value = ui ? ui.value : slider.slider('value');

    value = ((value - 2000) / 1000).toFixed(2);

    $("#size").text(value);
    let thumb = slider.children('.ui-slider-handle');
    let position = $('#sliderContainer').position().top + thumb.position().top;
    position = position + 10;
    $('#sliderLine').css('top', position);
    $('#size').css('top', position);
}

var _slides = [];
var _currentSlide = 0;

function previousSlide() {
    if (_currentSlide > 0) {
        let slide = _slides[_currentSlide];
        $('#' + slide).hide();
        _currentSlide--;
        slide = _slides[_currentSlide];
        $('#' + slide).show();
        startPromptTimer();

        $('#selectImage').hide();
        $('#alignImage').hide();
        $('#next').show();
        $('#skip').show();
    }
    if (_currentSlide == 0) {
        $('#previous').hide();
    }
}

function nextSlide() {
    if (_currentSlide < _slides.length - 1) {
        let slide = _slides[_currentSlide];
        $('#' + slide).hide();
        _currentSlide++;
        slide = _slides[_currentSlide];
        $('#' + slide).show();
        $('#previous').show();
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
    $('#next').hide();
    $('#previous').show();
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
        handles: 'n, e, s, w, ne, se, sw, nw',
        resize: updateHandles
    });
    $('#screenshot').draggable({
        drag: updateHandles
    });
    $('#screenshot').css('left', $('#lantern').position().left - 300);

    resize($('#userImage'), 600, 600 / $('#userImage').width() * $('#userImage').height());
    sliderMoved();
    updateHandles();
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

function uploadFile() {
    $("#dialogUploadConfirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Upload Screenshot": function() {
                $('#imageForm').submit();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });
}

function toggle(checkbox, container) {
    if (checkbox.is(':checked')) {
        container.show();
    } else {
        container.hide();
    }
}

function toggleTallest() {
    toggle($('#showTallest'), $('#tallestScreenshot'));
}

function toggleSmallest() {
    toggle($('#showSmallest'), $('#smallestScreenshot'));
}

function toggleTiny() {
    toggle($('#showTiny'), $('#tinyScreenshot'));
}

function toggleHuge() {
    toggle($('#showHuge'), $('#hugeScreenshot'));
}

function toggleChild() {
    toggle($('#showChild'), $('#childScreenshot'));
}

function toggleGrow() {
    toggle($('#showGrow'), $('#growScreenshot'));
}

function toggleShrink() {
    toggle($('#showShrink'), $('#shrinkScreenshot'));
}

function toggleOfficial() {
    toggle($('#showOfficial'), $('#officialChart'));
}

function toggleScreenshot() {
    toggle($('#showScreenshot'), $('#screenshot'));
}

function updateHandles() {
    let minSize = 32;
    let lantern = $('#lantern');
    let screenshot = $('#userImage');
    let leftSide = lantern.offset().left - 300;
    leftSide = Math.max(leftSide, minSize * 2);
    let rightSide = lantern.offset().left + lantern.width() + 300;
    rightSide = Math.min(rightSide, window.innerWidth - minSize * 2);
    let bottomSide = lantern.offset().top + lantern.height() + 100;
    bottomSide = Math.min(bottomSide, window.innerHeight - minSize * 2);
    let topSide = lantern.offset().top - 100;
    topSide = Math.max(topSide, minSize * 2);

    let topDelta = topSide - screenshot.offset().top;
    let bottomDelta = screenshot.offset().top + screenshot.height() - bottomSide;
    let leftDelta = leftSide - screenshot.offset().left;
    let rightDelta = screenshot.offset().left + screenshot.width() - rightSide;

    topDelta /= 2;
    bottomDelta /= 2;
    leftDelta /= 2;
    rightDelta /= 2;

    $('.ui-resizable-se').css('border-width', Math.max(minSize, rightDelta, bottomDelta));
    $('.ui-resizable-ne').css('border-width', Math.max(minSize, rightDelta, topDelta));
    $('.ui-resizable-sw').css('border-width', Math.max(minSize, leftDelta, bottomDelta));
    $('.ui-resizable-nw').css('border-width', Math.max(minSize, leftDelta, topDelta));
}

$(document).ready(initialize);