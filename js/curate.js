
function initialize() {
    $('#next').on('click', nextImage);
    $('#previous').on('click', previousImage);
    $('#skipEnd').on('click', skipEnd);
    $('#skipBeginning').on('click', skipBeginning);
    $('#deleteButton').on('click', deleteImage);
    updateImage();
}

function updateImage() {
    let filename = _screenshots[_currentScreenshot];
    $('#screenshot').prop('src', _folder + '/' + filename);
    $('#filename').text(filename);
    let originalFilename = filename.substr(6);
    $('#originalLink').prop('href', 'curated/' + originalFilename);
}

function nextImage() {
    _currentScreenshot++;
    if (_currentScreenshot == _screenshots.length - 1) {
        $('#next').hide();
        $('#skipEnd').hide();
    } else {
        $('#next').show();
        $('#skipEnd').show();
    }
    $('#previous').show();
    $('#skipBeginning').show();
    updateImage();
}

function previousImage() {
    _currentScreenshot--;
    if (_currentScreenshot == 0) {
        $('#previous').hide();
        $('#skipBeginning').hide();
    } else {
        $('#previous').show();
        $('#skipBeginning').show();
    }
    $('#next').show();
    $('#skipEnd').show();
    updateImage();
}

function skipEnd() {
    _currentScreenshot = _screenshots.length - 1;
    $('#next').hide();
    $('#skipEnd').hide();
    $('#previous').show();
    $('#skipBeginning').show();
    updateImage();
}

function skipBeginning() {
    _currentScreenshot = 0;
    $('#previous').hide();
    $('#skipBeginning').hide();
    $('#next').show();
    $('#skipEnd').show();
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