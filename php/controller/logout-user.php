<?php
    require_once(__DIR__ . "/../model/config.php");
    
    unset($_SESSION["authenticate"]);
    
    session_destroy();
    header("location: ".$path."index.php");
    
    