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
    $('#statsButton').button().on('click', showStats);
    $('#autoAlignButton').button().on('click', autoAlignImage);

    $("#slider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 4000,
        value: 2000,
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

    if (value == 0 || value == 4000) {
        flashSubmitButton();
        $('#statsButton').button('disable');
    } else {
        stopFlashSubmitButton();
        $('#statsButton').button('enable');
    }

    let position = $('#sliderContainer').position().top + $('#sliderContainer').height() * (4000 - value) / 4000;
    $('#sliderLine').css('top', position);
    $('#size').css('top', position);

    value = ((value - 2000) / 1000).toFixed(3);
    $("#size").text(value);
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
                $(this).dialog("close");
                $("#dialogUploadReallyConfirm").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "Yes, Really Upload Screenshot": function() {
                            $('#imageForm').submit();
                            $(this).dialog("close");
                        },
                        Cancel: function() {
                            $(this).dialog("close");
                        }
                    }
                });
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });
}

function percentile(percent) {
   let digit = percent % 10;
   switch (digit) {
       case 1: percent += 'st'; break;
       case 2: percent += 'nd'; break;
       case 3: percent += 'rd'; break;
       default: percent += 'th'; break;
   }
   return percent;
}

var _potionAttempts = [3, 9, 20, 50];
function showStats() {
    let statsDialog = '#dialogStats';
    let slider = $("#slider");
    let value = slider.slider('value');
    if (value < 2050 && value > 1950) {
        statsDialog = '#dialogMiddleStats';
    } else {
       if (value > 2000) {
           let percent = Math.round(100 * (value - 2000) / 2000);
           percent = percentile(percent);
           $('#stats_percentileType').text('tallness');
           $('#stats_percentile').text(percent);
           $('#stats_nextType').text('taller');

           for (let i = 0; i < _potionAttempts.length; i++) {
               let attempts = _potionAttempts[i];
               let index = i + 1;
               let chance = ((value - 2000) / 2000);
               chance = Math.pow(chance, attempts);
               chance = Math.floor((100 * (1 - chance))).toFixed(0);
               if (chance == 100) chance = 99;
               $('#stats_potions' + index).text(attempts);
               $('#stats_chance' + index).text(chance);
               $('#stats_type' + index).text('taller');
           }
       } else if (value < 2000) {
           value = 4000 - value;
           let percent = Math.round(100 * (value - 2000) / 2000);
           percent = percentile(percent);
           $('#stats_percentileType').text('smallness');
           $('#stats_percentile').text(percent);
           $('#stats_nextType').text('shorter');

           for (let i = 0; i < _potionAttempts.length; i++) {
               let attempts = _potionAttempts[i];
               let index = i + 1;
               let chance = ((value - 2000) / 2000);
               chance = Math.pow(chance, attempts);
               chance = Math.floor((100 * (1 - chance))).toFixed(0);
               if (chance == 100) chance = 99;
               $('#stats_potions' + index).text(attempts);
               $('#stats_chance' + index).text(chance);
               $('#stats_type' + index).text('shorter');
           }
       }
    }

    $(statsDialog).dialog({
        resizable: false,
        height: "auto",
        width: 500,
        modal: true,
        buttons: {
            OK: function() {
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

    $('.ui-resizable-se').css('border-right-width', Math.max(minSize, rightDelta));
    $('.ui-resizable-se').css('border-top-width', Math.max(minSize, bottomDelta));

    $('.ui-resizable-ne').css('border-right-width', Math.max(minSize, rightDelta));
    $('.ui-resizable-ne').css('border-bottom-width', Math.max(minSize, topDelta));

    $('.ui-resizable-sw').css('border-left-width', Math.max(minSize, leftDelta));
    $('.ui-resizable-sw').css('border-top-width', Math.max(minSize, bottomDelta));

    $('.ui-resizable-nw').css('border-left-width', Math.max(minSize, leftDelta));
    $('.ui-resizable-nw').css('border-bottom-width', Math.max(minSize, topDelta));
}

var _submitFlashTimer = null;
var _submitIsHighlighted = false;
function highlightSubmitButton() {
    $('#uploadButton').css('background-color', 'red')
    $('#uploadButton').css('color', 'white');
    _submitIsHighlighted = true;
}

function unhighlightSubmitButton() {
    $('#uploadButton').css('background-color', 'white')
    $('#uploadButton').css('color', 'black');
    _submitIsHighlighted = false;
}

function scheduleFlashSubmitButton() {
    _submitFlashTimer = setTimeout(function() {
        if (_submitIsHighlighted) {
            unhighlightSubmitButton();
        } else {
            highlightSubmitButton();
        }
        scheduleFlashSubmitButton();
    }, 1000);
}

function flashSubmitButton() {
    stopFlashSubmitButton();
    highlightSubmitButton();
    scheduleFlashSubmitButton();
}

function stopFlashSubmitButton() {
    if (_submitFlashTimer != null) {
        clearTimeout(_submitFlashTimer);
    }
    unhighlightSubmitButton();
}

function autoAlignImage() {
    $('#autoAlignButton').button('disable');
    $('#loadingScreen').show();

    let form = $('#imageForm')[0];
    let formData = new FormData(form);

    $.ajax('align.php', {
        complete: processAlignResult,
        data: formData,
        processData: false,
        contentType: false,
        method: 'POST',
        dataType: 'json'
    });
}

function processAlignResult(result, resultType) {
    $('#loadingScreen').hide();
    if (resultType != 'success') {
        alert('Sorry, something went wrong with the auto-align: ' + resultType);
        return;
    }
    if (result.responseJSON == null) {
        alert('Sorry, something went wrong with the auto-align (Missing responseJSON)');
        return;
    }

    if (!result.responseJSON.success) {
        alert('Sorry, something went wrong with the auto-align: ' + result.responseJSON.message);
        return;
    }

    const alignedLantern = result.responseJSON.lantern;
    const scale = 1 / alignedLantern.scale;

    let screenshot = $('#userImage');
    let container = $('#screenshot');
    let targetWidth = screenshot.get(0).naturalWidth * scale;

    // This is really fudgy, and I'm not sure why yet
    container.css('left', $('#lantern').position().left - alignedLantern.left * scale - $('#lantern').width() / 2 - 8);
    container.css('top', $('#lantern').position().top - alignedLantern.top * scale - $('#lantern').height() / 4 - 8);

    resize(screenshot, targetWidth, targetWidth / screenshot.width() * screenshot.height());

    sliderMoved();
    updateHandles();
}


$(document).ready(initialize);