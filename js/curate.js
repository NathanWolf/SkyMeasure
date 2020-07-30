
function initialize() {
    $('#next').on('click', nextImage);
    $('#previous').on('click', previousImage);
    $('#deleteButton').on('click', deleteImage);
    updateImage();
}

function updateImage() {
    let filename = _screenshots[_currentScreenshot];
    $('#screenshot').prop('src', 'cropped/' + filename);
    $('#filename').text(filename);
    let originalFilename = filename.substr(6);
    $('#originalLink').prop('href', 'curated/' + originalFilename);
}

function nextImage() {
    _currentScreenshot++;
    if (_currentScreenshot == _screenshots.length - 1) {
        $('#next').hide();
    } else {
        $('#next').show();
    }
    $('#previous').show();
    updateImage();
}

function previousImage() {
    _currentScreenshot--;
    if (_currentScreenshot == 0) {
        $('#previous').hide();
    } else {
        $('#previous').show();
    }
    $('#next').show();
    updateImage();
}

function deleteImage() {
    let filename = _screenshots[_currentScreenshot];

    $.ajax('delete.php', {
        complete: processDeleteResult,
        data: {'filename': filename},
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