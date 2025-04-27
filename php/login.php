<?php
session_start();
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT id, password, is_verified FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            if (password_verify($password, $row['password'])) {
                if ($row['is_verified']) {
                    $_SESSION['user_id'] = $row['id'];
                    echo "Login successful.";
                } else {
                    echo "Please verify your email.";
                }
            } else {
                echo "Invalid credentials.";
            }
        } else {
            echo "Invalid credentials.";
        }
    } else {
        echo "Error: " . $conn->error;
    }
    $stmt->close();
}
