<?php
?>
<html>
    <head>
        <title>Sky Screenshot Upload</title>

        <link rel="shortcut icon" href="image/favicon.png" type="image/png" />
        <link rel="stylesheet" href="css/sky.css">
    </head>
    <body>
    <div class="slideContainer">
<?php
function processFile() {
    $targetDir = "uploads/";
    $targetFile = basename($_FILES["screenshot"]["name"]);
    $imageFileType = strtolower(pathinfo($targetFile,PATHINFO_EXTENSION));
    $targetFileBase = strtolower(pathinfo($targetFile,PATHINFO_BASENAME));
    $targetFile = $targetDir . $targetFile;

    // Check if image file is a actual image
    if (isset($_POST["submit"])) {
      $check = getimagesize($_FILES["screenshot"]["tmp_name"]);
      if ($check === false) {
        echo "Sorry, I could not process that file!";
        return;
      }
    }

    // Check file size
    if ($_FILES["screenshot"]["error"] == 1) {
      echo "Sorry, your file can not be larger than: " . ini_get('upload_max_filesize');
      return;
    }

    // Check for other error
    if ($_FILES["screenshot"]["error"] != 0) {
      echo "Sorry, something went wrong. Error code: " . $_FILES["screenshot"]["error"];
      return;
    }

    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
      echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
      return;
    }


    // Find a filename if this one exists
    $index = 1;
    while (file_exists($targetFile)) {
        $targetFile = $targetDir . $targetFileBase . '.' . $index . '.' . $imageFileType;
    }

    // Move file in place

    if (move_uploaded_file($_FILES["screenshot"]["tmp_name"], $targetFile)) {
        echo "The file " . basename( $_FILES["screenshot"]["name"]) . " has been uploaded.";
    ?>
      <div>
          <p>
          We will look at it, and if you are out of range we'll adjust the tool to fit!
          </p><p>
          That will make you the tallest or the smallest Sky kid we've seen.
          </p><p>
              In which case, we may use your screenshot as proof of the ranges the tool expects.
          </p>
          <p>
              Thank you for your help!
          </p>
      </div>
    <?php
    } else {
        echo "Sorry, there was an error uploading your file!";
    }
}

processFile();

?>
        </div>
    <div style="margin-top: 100px" class="slideContainer">
        <a href="/" style="color: white">Back to the measuring tool</a>
    </div>
    </body>
</html>
