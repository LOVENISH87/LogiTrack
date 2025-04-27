<?php
// $host = 'localhost';
// $username = 'root';
// $password = '';
// $database = 'logitrack_db'; // Make sure this DB exists and has the users table
// $host = 'localhost'; // or 127.0.0.1
// $username = 'root';
// $password = ''; // or your MySQL root password
// $database = 'logitrack_db';

// $conn = new mysqli($host, $username, $password, $database);

// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }
// real one->


$servername = "localhost"; // Or 127.0.0.1 if localhost doesn't work
$username = "root";
$password = "";  // Leave it empty because password is NO
$database = "logitrack_db"; // make sure you have created this database

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected successfully to database!";
