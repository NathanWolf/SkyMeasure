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
    <link rel="stylesheet" href="css/curate.css?v=1">

    <script src="http://code.jquery.com/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="js/jquery.ui.touch-punch.min.js"></script>

    <script src="js/curate.js?v=1"></script>

    <script type="text/javascript">
        var _screenshots = <?= json_encode($files) ?>;
        var _currentScreenshot = 0;
        var _folder = '<?= $folder ?>';
    </script>
</head>
<body>

    <div id="filename"></div>
    <div id="previous" style="display: none" class="ui-icon ui-icon-arrowthick-1-w" title="Go back one step"></div>
    <div id="next" class="ui-icon ui-icon-arrowthick-1-e" title="Go forward one step"></div>

    <div id="screenshotContainer">
        <img id="screenshot" alt="Screenshot" src="image/blank.png"/>
    </div>

    <div id="deleteButton" class="ui-icon ui-icon-trash" title="Delete this screenshot"></div>

    <a href="" target="_new" id="originalLink">Show original</a>
</body>
</html>
