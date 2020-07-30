
function initialize() {
    $('#next').button({showLabel: false}).on('click', nextImage);
    $('#skipBeginning').button({showLabel: false}).on('click', skipBeginning);
    $('#previous').button({showLabel: false}).on('click', previousImage);
    $('#skipEnd').button({showLabel: false}).on('click', skipEnd);
    $('#deleteButton').button({showLabel: false}).on('click', deleteImage);
    skipBeginning();
}

function updateImage() {
    let filename = _screenshots[_currentScreenshot];
    $('#screenshot').prop('src', _folder + '/' + filename);
    $('#filename').text(filename);
    let originalFilename = filename.substr(6);
    $('#originalLink').prop('href', 'curated/' + originalFilename);

    $('#currentIndex').text(_currentScreenshot + 1);
    $('#maxIndex').text(_screenshots.length);
}

function nextImage() {
    if (_currentScreenshot == _screenshots.length - 1) return;
    _currentScreenshot++;
    if (_currentScreenshot == _screenshots.length - 1) {
        $('#next').button('disable');
        $('#skipEnd').button('disable');
    } else {
        $('#next').button('enable');
        $('#skipEnd').button('enable');
    }
    $('#previous').button('enable');
    $('#skipBeginning').button('enable');
    updateImage();
}

function previousImage() {
    if (_currentScreenshot == 0) return;

    _currentScreenshot--;
    if (_currentScreenshot == 0) {
        $('#previous').button('disable');
        $('#skipBeginning').button('disable');
    } else {
        $('#previous').button('enable');
        $('#skipBeginning').button('enable');
    }
    $('#next').button('enable');
    $('#skipEnd').button('enable');
    updateImage();
}

function skipEnd() {
    _currentScreenshot = _screenshots.length - 1;
    $('#next').button('disable');
    $('#skipEnd').button('disable');
    $('#previous').button('enable');
    $('#skipBeginning').button('enable');
    updateImage();
}

function skipBeginning() {
    _currentScreenshot = 0;
    $('#previous').button('disable');
    $('#skipBeginning').button('disable');
    $('#next').button('enable');
    $('#skipEnd').button('enable');
    updateImage();
}

function deleteImage() {
    let filename = _screenshots[_currentScreenshot];

    $.ajax('delete.php', {
        complete: processDeleteResult,
        data: {'filename': filename, 'folder': _folder},
        dataType: 'json'
    });
}

function processDeleteResult(result, resultType) {
    if (resultType != 'success') {
        alert('Sorry, something went wrong with the delete: ' + resultType);
        return;
    }
    if (result.responseJSON == null) {
        alert('Sorry, something went wrong with the delete (Missing responseJSON)');
        return;
    }

    if (!result.responseJSON.success) {
        alert('Sorry, something went wrong with the delete: ' + result.responseJSON.message);
        return;
    }

    alert('Done, son!');
}


$(document).ready(initialize);