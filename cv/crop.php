<?php

if (PHP_SAPI !== 'cli') {
    die('Must be run from the terminal.');
}

if (count($argv) < 3) {
    die("Usage: crop.php <source folder> <target folder>\n");
}

$sourceFolder = $argv[1];
$targetFolder = $argv[2];

function execProcess($cmd, &$stdout=null, &$stderr=null) {
    $proc = proc_open($cmd,[
        1 => ['pipe','w'],
        2 => ['pipe','w'],
    ],$pipes);
    $stdout = stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[2]);
    return proc_close($proc);
}

$targetWidth = 640;
$targetHeight = 1024;

$iterator = new DirectoryIterator($sourceFolder);
foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDot()) continue;
    $filename = $fileInfo->getFilename();
    $pathname = $fileInfo->getPath();
    $sourceFile = $pathname . '/' . $filename;

    $wildcard = $targetFolder . '*_' . $filename;
    $list = glob($wildcard);
    if ($list) {
        echo "Skipping $filename, target already exists\n";
        continue;
    }

    echo "Reading $filename\n";
    $escaped = escapeshellarg($sourceFile);
    $responseCode = execProcess("python align.py --image $escaped", $results, $errors);
    if ($responseCode !== 0) {
        echo "   ERROR: $responseCode ($errors)\n";
        continue;
    }

    $response = json_decode($results, true);
    $image = imagecreatefromstring(file_get_contents($sourceFile));
    if (!$image) {
        echo "  Could not load file\n";
        continue;
    }

    $cropped = imagecreatetruecolor($targetWidth, $targetHeight);

    $width = imagesx($image);
    $height = imagesy($image);
    $aspectRatio = $width / $height;
    $targetAspectRatio = $targetWidth / $targetHeight;
    $lanternWidth = $response['lantern']['right']  - $response['lantern']['left'];
    $padding = $lanternWidth / 10;


    $left = $response['lantern']['left'] - ($lanternWidth + $padding);
    $right = $response['lantern']['right'] + $padding;

    $top = $response['lantern']['top'] - $padding;
    $bottom = $response['lantern']['bottom'] - ($padding * 2);

    $lanternSize = $response['lantern']['bottom'] - $response['lantern']['top'];
    $hairRatio = ($response['hair']['top'] - $response['lantern']['top']) / $lanternSize;
    $hairRatio = floor($hairRatio * 1000);
    if ($hairRatio < 0) {
        echo "Hair is out of range, skipping\n";
        continue;
    }
    $hairRatio = str_pad($hairRatio, 5, '0', STR_PAD_LEFT);
    $targetFile = $targetFolder . $hairRatio . '_' . $filename;

    $sourceWidth = $right - $left;

    // Resize and crop
    imagecopyresampled($cropped,
                     $image,
                     0,
                     0,
                     $left, $top,
                     $targetWidth, $targetHeight,
                     $sourceWidth, $sourceWidth / $targetAspectRatio);

    imagejpeg($cropped, $targetFile, 80);
    echo "  Wrote $targetFile\n";
}