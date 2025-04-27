<!-- // require_once 'db_connect.php';
// header('Content-Type: application/json');

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
// $name = $_POST['name'] ?? '';
// $email = $_POST['email'] ?? '';
// $subject = $_POST['subject'] ?? '';
// $message = $_POST['message'] ?? '';
// $submission_date = date('Y-m-d H:i:s');

// if (empty($name) || empty($email) || empty($subject) || empty($message)) {
// echo json_encode(['success' => false, 'message' => 'All fields are required.']);
// exit;
// }

// // Use prepared statement
// $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, submission_date) VALUES (?, ?, ?, ?, ?)");
// $stmt->bind_param("sssss", $name, $email, $subject, $message, $submission_date);

// if ($stmt->execute()) {
// echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
// } else {
// echo json_encode(['success' => false, 'message' => 'DB Error: ' . $stmt->error]);
// }

// $stmt->close();
// $conn->close();
// } else {
// echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
// }

php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// require_once 'db_connect.php';
// header('Content-Type: application/json');

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
// $name = $_POST['name'] ?? '';
// $email = $_POST['email'] ?? '';
// $subject = $_POST['subject'] ?? '';
// $message = $_POST['message'] ?? '';
// $submission_date = date('Y-m-d H:i:s');

// if (empty($name) || empty($email) || empty($subject) || empty($message)) {
// echo json_encode(['success' => false, 'message' => 'All fields are required.']);
// exit;
// }

// // Use prepared statement
// $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, submission_date) VALUES (?, ?, ?, ?, ?)");
// $stmt->bind_param("sssss", $name, $email, $subject, $message, $submission_date);

// if ($stmt->execute()) {
// echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
// } else {
// echo json_encode(['success' => false, 'message' => 'DB Error: ' . $stmt->error]);
// }

// $stmt->close();
// $conn->close();
// } else {
// echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
// }

/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'db_connect.php';

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';
$submission_date = date('Y-m-d H:i:s');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// 👇 TRY to prepare the SQL and catch errors manually
$stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, submission_date) VALUES (?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("sssss", $name, $email, $subject, $message, $submission_date);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Message stored successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
*/  
<!?php -->
<!-- // require_once '../db_connect.php'; // adjust path as needed

// header('Content-Type: application/json');

// // Enable errors (for development only)
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $name = trim($_POST['name'] ?? '');
//     $email = trim($_POST['email'] ?? '');
//     $subject = trim($_POST['subject'] ?? '');
//     $message = trim($_POST['message'] ?? '');

//     if (empty($name) || empty($email) || empty($subject) || empty($message)) {
//         echo json_encode(['success' => false, 'message' => 'All fields are required.']);
//         exit;
//     }

//     if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//         echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
//         exit;
//     }

//     $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
//     if (!$stmt) {
//         echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
//         exit;
//     }

//     $stmt->bind_param("ssss", $name, $email, $subject, $message);

//     if ($stmt->execute()) {
//         echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
//     }

//     $stmt->close();
//     $conn->close();
// } else {
//     echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
// }
// ?> -->


<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $sql = "INSERT INTO contact (name, email, message) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $message);

    if ($stmt->execute()) {
        echo "Message sent successfully.";
    } else {
        echo "Error sending message.";
    }
    $stmt->close();
}
?>