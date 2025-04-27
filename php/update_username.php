<?php
session_start();
include 'db_connect.php';

if (isset($_SESSION['user_id']) && $_SERVER["REQUEST_METHOD"] === "POST") {
    $new_username = $_POST['new_username'];

    $sql = "UPDATE users SET username = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $new_username, $_SESSION['user_id']);

    if ($stmt->execute()) {
        echo "Username updated successfully.";
    } else {
        echo "Error updating username.";
    }
    $stmt->close();
}
