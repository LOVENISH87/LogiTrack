<?php
session_start();
include 'db_connect.php';

if (isset($_SESSION['user_id']) && $_SERVER["REQUEST_METHOD"] === "POST") {
    $current_password = $_POST['current_password'];
    $new_password = password_hash($_POST['new_password'], PASSWORD_DEFAULT);

    $sql = "SELECT password FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $stmt->bind_result($db_password);
    $stmt->fetch();
    $stmt->close();

    if (password_verify($current_password, $db_password)) {
        $update_sql = "UPDATE users SET password = ? WHERE id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("si", $new_password, $_SESSION['user_id']);
        if ($update_stmt->execute()) {
            echo "Password updated successfully.";
        } else {
            echo "Error updating password.";
        }
        $update_stmt->close();
    } else {
        echo "Current password incorrect.";
    }
}
