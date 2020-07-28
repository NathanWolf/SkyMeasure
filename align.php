<?php
if (!isset($_FILES["screenshot"])) {
    die(json_encode(array('success' => false, 'message' => 'Missing attached screenshot')));
}
$filename = $_FILES["screenshot"]["tmp_name"];
if (!file_exists($filename)) {
    die(json_encode(array('success' => false, 'message' => 'Failed to read uploaded file')));
}

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

$responseCode = execProcess("python cv/align.py --image $filename --template cv/lantern.png", $results, $errors);

if ($responseCode !== 0) {
    die(json_encode(array('success' => false, 'message' => 'Matching script failure (' . $responseCode . '): ' . $errors)));
}

echo $results;