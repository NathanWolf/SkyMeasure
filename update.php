<?php
header("Content-Type: text/plain; charset=utf-8");
set_time_limit(60 * 60);
$client = $_SERVER['REMOTE_ADDR'];
if (strpos($client, '192.168.1') !== 0) {
    die(json_encode(array('success' => false, 'message' => 'Sorry, internet randos are not allowed to delete files!')));
}

chdir('cv');
passthru("php crop.php ../uploads/ ../cropped/ ../curated/");