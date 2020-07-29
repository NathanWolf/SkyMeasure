<?php

$files = array();
$iterator = new DirectoryIterator('cropped');
foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDot()) continue;
    $filename = $fileInfo->getFilename();
    array_push($files, $filename);
}

sort($files);

echo json_encode($files);