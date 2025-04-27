<?php
include 'db_connect.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    $sql = "UPDATE users SET is_verified = 1 WHERE verification_token = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $token);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo "Email verified successfully!";
    } else {
        echo "Invalid or already used token.";
    }
    $stmt->close();
}
