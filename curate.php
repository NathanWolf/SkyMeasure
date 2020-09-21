<?php

$folder = 'cropped';
$fileDescriptors = array();
$iterator = new DirectoryIterator($folder);
foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDot()) continue;
    array_push($fileDescriptors, array(
        'modTime' => $fileInfo->getMTime(),
        'filename' => $fileInfo->getFilename()
    ));
}

function compareMTime($a, $b) {
    return $b['modTime'] - $a['modTime'];
}

usort($fileDescriptors, 'compareMTime');

$files = array();
$modTimes = array();
function indexFile($file) {
    global $modTimes;
    global $files;

    $modTimes[$file['filename']] = $file['modTime'];
    array_push($files, $file['filename']);
}
array_map('indexFile', $fileDescriptors);

?>
<html lang="en">
<head>
    <title>Sky Screenshot Curation</title>

    <link rel="shortcut icon" href="image/favicon.png" type="image/png" />

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="css/curate.css?v=3">

    <script src="///code.jquery.com/jquery.min.js"></script>
    <script src="///code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="js/jquery.ui.touch-punch.min.js"></script>

    <script src="js/curate.js?v=3"></script>

    <script type="text/javascript">
        var _screenshots = <?= json_encode($files) ?>;
        var _modTimes = <?= json_encode($modTimes) ?>;
        var _currentScreenshot = 0;
        var _folder = '<?= $folder ?>';
    </script>
</head>
<body>

    <div id="toolbar">
        <button id="skipBeginning" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="Go back to the first image">
            <span class="ui-icon ui-icon-arrowthickstop-1-w"></span> First
        </button>
        <button id="previous" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="Go back one image">
            <span class="ui-icon ui-icon-arrowthick-1-w"></span> Previous
        </button>
        <button id="sort" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="Go back one image">
            <span class="ui-icon ui-icon-shuffle"></span> Sort
        </button>
        <div class="toolbarElement">
            <span id="currentIndex"></span>
            /
            <span id="maxIndex"></span>
        </div>
        <div id="filename" class="toolbarElement"></div>


        <button id="next" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="Go forward one image">
            <span class="ui-icon ui-icon-arrowthick-1-e"></span> Next
        </button>
        <button id="skipEnd" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="Go to the last image">
            <span class="ui-icon ui-icon-arrowthickstop-1-e"></span> Last
        </button>
    </div>
    <div id="modTime">

    </div>
    <div id="screenshotContainer">
        <img id="screenshot" alt="Screenshot" src="image/blank.png"/>
    </div>

    <div id="bottomToolbar">
        <button id="deleteButton" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="Delete this screenshot">
            <span class="ui-icon ui-icon-trash"></span> Delete
        </button>
    </div>

    <div id="linkToolbar">
        <a href="" target="_new" id="originalLink">Show original</a>
    </div>
</body>
</html>
