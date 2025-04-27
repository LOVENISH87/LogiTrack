<?php
require_once 'db_connect.php';
session_start();

// Replace with a valid user ID for now, or use session if logged in
$user_id = 1; // TODO: Replace with dynamic session or form value
$order_id = uniqid("ORD");
$product_name = "Tomatoes";
$quantity = 5;
$status = "Processing";

$stmt = $conn->prepare("INSERT INTO orders (user_id, order_id, product_name, quantity, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issis", $user_id, $order_id, $product_name, $quantity, $status);

if ($stmt->execute()) {
    echo "Order placed successfully with ID: $order_id";
} else {
    echo "Failed to insert order: " . $stmt->error;
}

$stmt->close();
$conn->close();
