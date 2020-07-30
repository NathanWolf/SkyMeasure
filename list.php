<?php

$files = array();
$directory = 'cropped';
$iterator = new DirectoryIterator($directory);
foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDot()) continue;
    $filename = $fileInfo->getFilename();
    array_push($files, $directory . '/' . $filename);
}

sort($files);

echo json_encode($files);