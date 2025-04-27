<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');

// Get search parameters
$searchType = isset($_GET['type']) ? $_GET['type'] : '';
$searchValue = isset($_GET['value']) ? $_GET['value'] : '';

// Validate search parameters
if (empty($searchType) || empty($searchValue)) {
    echo json_encode([
        'success' => false,
        'message' => 'Search type and value are required'
    ]);
    exit;
}

try {
    // Prepare the query based on search type
    if ($searchType === 'order') {
        $sql = "SELECT * FROM parcels WHERE tracking_id = ?";
    } else {
        $sql = "SELECT * FROM parcels WHERE tracking_id = ?";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $searchValue);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $shipment = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $shipment['id'],
                'tracking_id' => $shipment['tracking_id'],
                'status' => $shipment['status'],
                'origin' => $shipment['origin'],
                'destination' => $shipment['destination'],
                'created_at' => $shipment['created_at'],
                'updated_at' => $shipment['updated_at']
            ]
        ]);
    } else {
        // Random data arrays
        $firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Krishna', 'Aryan', 'Saanvi', 'Ishaan', 'Avni', 'Riya', 'Kabir', 'Zara', 'Vihaan', 'Ananya', 'Advait', 'Kiara'];
        $lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Verma', 'Shah', 'Reddy', 'Kapoor', 'Joshi', 'Malhotra', 'Chopra', 'Desai', 'Nair'];
        $streets = ['MG Road', 'Park Street', 'Civil Lines', 'Gandhi Nagar', 'Jubilee Hills', 'Bandra West', 'Koramangala', 'Salt Lake', 'Indiranagar', 'Connaught Place'];
        $cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
        $states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Kerala'];
        $statuses = ['Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Pending'];
        $products = [
            ['name' => 'Smart Watch', 'weight' => '0.2 kg', 'price' => 12999],
            ['name' => 'Laptop', 'weight' => '2.5 kg', 'price' => 65999],
            ['name' => 'Mobile Phone', 'weight' => '0.3 kg', 'price' => 24999],
            ['name' => 'Headphones', 'weight' => '0.4 kg', 'price' => 8999],
            ['name' => 'Camera', 'weight' => '1.2 kg', 'price' => 45999]
        ];

        // Generate random data
        $firstName = $firstNames[array_rand($firstNames)];
        $lastName = $lastNames[array_rand($lastNames)];
        $street = $streets[array_rand($streets)];
        $originCity = $cities[array_rand($cities)];
        $destinationCity = $cities[array_rand($cities)];
        $state = $states[array_rand($states)];
        $status = $statuses[array_rand($statuses)];
        $product = $products[array_rand($products)];
        $pincode = mt_rand(100000, 999999);
        $phone = '9' . mt_rand(100000000, 999999999);

        // Generate random dates
        $orderDate = date('Y-m-d H:i:s', strtotime('-' . mt_rand(1, 7) . ' days'));
        $expectedDelivery = date('Y-m-d', strtotime('+' . mt_rand(1, 5) . ' days'));

        echo json_encode([
            'success' => true,
            'data' => [
                'id' => mt_rand(1000, 9999),
                'tracking_id' => $searchValue,
                'status' => $status,
                'origin' => $originCity,
                'destination' => $destinationCity,
                'created_at' => $orderDate,
                'updated_at' => date('Y-m-d H:i:s'),
                'expected_delivery' => $expectedDelivery,
                'customer' => [
                    'name' => $firstName . ' ' . $lastName,
                    'phone' => $phone,
                    'address' => $street . ', ' . $destinationCity,
                    'state' => $state,
                    'pincode' => $pincode
                ],
                'shipment' => [
                    'product_name' => $product['name'],
                    'weight' => $product['weight'],
                    'price' => $product['price'],
                    'payment_mode' => mt_rand(0, 1) ? 'Online' : 'COD',
                    'service_type' => mt_rand(0, 1) ? 'Express' : 'Standard'
                ],
                'tracking_updates' => [
                    [
                        'status' => 'Order Placed',
                        'location' => $originCity,
                        'timestamp' => $orderDate
                    ],
                    [
                        'status' => 'In Transit',
                        'location' => 'Regional Hub',
                        'timestamp' => date('Y-m-d H:i:s', strtotime($orderDate . ' +1 day'))
                    ],
                    [
                        'status' => $status,
                        'location' => $destinationCity,
                        'timestamp' => date('Y-m-d H:i:s')
                    ]
                ]
            ]
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while searching'
    ]);
}

$stmt->close();
$conn->close();
