<?php
// // Enable debugging (optional)
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// // Start session
// session_start();

// // DB connection
// $host = 'localhost';
// $username = 'root';
// $password = ''; // Use your DB password
// $database = 'logitrack_db';

// $conn = new mysqli($host, $username, $password, $database);
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }

// // Only allow POST requests
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $username = trim($_POST['username'] ?? '');
//     $email = trim($_POST['email'] ?? '');
//     $phone = trim($_POST['phone'] ?? '');
//     $password = trim($_POST['password'] ?? '');
//     $confirm = trim($_POST['confirm_password'] ?? '');

//     // Basic validation
//     if (empty($username) || empty($email) || empty($phone) || empty($password) || empty($confirm)) {
//         exit("All fields are required.");
//     }

//     if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//         exit("Invalid email format.");
//     }

//     if ($password !== $confirm) {
//         exit("Passwords do not match.");
//     }

//     // Check if email already exists
//     $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
//     $stmt->bind_param("s", $email);
//     $stmt->execute();
//     $stmt->store_result();

//     if ($stmt->num_rows > 0) {
//         exit("Email already registered.");
//     }

//     $stmt->close();

//     // Insert new user
//     $hashed = password_hash($password, PASSWORD_DEFAULT);
//     $stmt = $conn->prepare("INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)");
//     $stmt->bind_param("ssss", $username, $email, $phone, $hashed);

//     if ($stmt->execute()) {
//         $_SESSION['user_id'] = $stmt->insert_id;
//         $_SESSION['username'] = $username;
//         $_SESSION['email'] = $email;

//         echo "<script>alert('Registration successful! Redirecting...'); window.location.href = 'dashboard.html';</script>";
//     } else {
//         exit("Error: " . $stmt->error);
//     }

//     $stmt->close();
//     $conn->close();
// } else {
//     // ❌ Method Not Allowed Fix
//     http_response_code(405);
//     exit("Method not allowed.");
// }



include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $username = $_POST['username'];
    $phone = $_POST['phone'];  // <--- new

    $verification_token = bin2hex(random_bytes(16));

    $sql = "INSERT INTO users (email, password, username, phone, is_verified, verification_token) 
            VALUES (?, ?, ?, ?, 0, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $email, $password, $username, $phone, $verification_token);

    if ($stmt->execute()) {
        echo "Registration successful. Please verify your email.";
    } else {
        echo "Error: " . $conn->error;
    }
    $stmt->close();
}
