<?php

if (!isset($_REQUEST['filename'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing filename parameter')));
}

$croppedFile = $_REQUEST['filename'];
$movedFile = 'deleted/' . substr($croppedFile, 6);
$originalFile = 'curated/' . substr($croppedFile, 6);
$croppedFile = 'cropped/' . $croppedFile;
if (!file_exists($croppedFile)) {
    die(json_encode(array('success' => false, 'message' => 'Could not find file: ' . $croppedFile)));
}
if (!file_exists($originalFile)) {
    die(json_encode(array('success' => false, 'message' => 'Could not find file: ' . $originalFile)));
}

rename($originalFile, $movedFile);
unlink($croppedFile);

die(json_encode(array('success' => true, 'message' => 'Deleted: ' . $originalFile . ' and ' . $croppedFile)));
