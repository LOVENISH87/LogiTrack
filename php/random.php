<?php
require_once 'db_connect.php';

// generate random fake data
$tracking_id = 'TEST' . rand(1000, 9999);
$status = 'Processing';
$origin = 'Delhi';
$destination = 'Mumbai';
$created_at = date('Y-m-d H:i:s');
$updated_at = date('Y-m-d H:i:s');
$customer_name = 'Random Customer';
$customer_phone = '9' . rand(100000000, 999999999);
$customer_address = '123 Random Street';
$customer_state = 'Maharashtra';
$customer_pincode = rand(100000, 999999);
$product_name = 'Smartphone';
$product_weight = '0.5kg';
$product_price = 15000;
$payment_mode = 'COD';
$service_type = 'Standard';

// insert into database
$sql = "INSERT INTO parcels (tracking_id, status, origin, destination, created_at, updated_at, customer_name, customer_phone, customer_address, customer_state, customer_pincode, product_name, product_weight, product_price, payment_mode, service_type) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssssssssssssss",
    $tracking_id,
    $status,
    $origin,
    $destination,
    $created_at,
    $updated_at,
    $customer_name,
    $customer_phone,
    $customer_address,
    $customer_state,
    $customer_pincode,
    $product_name,
    $product_weight,
    $product_price,
    $payment_mode,
    $service_type
);

if ($stmt->execute()) {
    echo "Inserted successfully! Tracking ID: " . $tracking_id;
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
