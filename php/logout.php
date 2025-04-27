<?php
// // Start session
// session_start();

// // Unset all session variables
// $_SESSION = array();

// // Destroy the session
// session_destroy();

// // Redirect to login page
// header('Location: ../index.html');
// exit;


session_start();
session_unset();
session_destroy();
echo "Logged out successfully.";
