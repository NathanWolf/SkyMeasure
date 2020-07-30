<?php

$folder = 'cropped';
$files = array();
$iterator = new DirectoryIterator($folder);
foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDot()) continue;
    $filename = $fileInfo->getFilename();
    array_push($files, $filename);
}

sort($files);

?>
<html lang="en">
<head>
    <title>Sky Screenshot Curation</title>

    <link rel="shortcut icon" href="image/favicon.png" type="image/png" />

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="css/curate.css?v=2">

    <script src="http://code.jquery.com/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="js/jquery.ui.touch-punch.min.js"></script>

    <script src="js/curate.js?v=2"></script>

    <script type="text/javascript">
        var _screenshots = <?= json_encode($files) ?>;
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
