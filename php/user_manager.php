<?php
// Include database connection
require_once 'db_connect.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

class UserManager
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    /**
     * Register a new user
     * @param string $username
     * @param string $email
     * @param string $password
     * @param string $phone
     * @return array
     */
    public function register($username, $email, $password, $phone)
    {
        // Validate input
        if (empty($username) || empty($email) || empty($password) || empty($phone)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email format'];
        }

        // Check if email already exists
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return ['success' => false, 'message' => 'Email already registered'];
        }

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user
        $stmt = $this->conn->prepare("INSERT INTO users (username, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param("ssss", $username, $email, $phone, $hashed_password);

        if ($stmt->execute()) {
            // Get the new user ID
            $user_id = $this->conn->insert_id;

            // Set session variables
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;

            return [
                'success' => true,
                'message' => 'Registration successful',
                'user_id' => $user_id
            ];
        } else {
            return ['success' => false, 'message' => 'Registration failed: ' . $stmt->error];
        }
    }

    /**
     * Login a user
     * @param string $email
     * @param string $password
     * @return array
     */
    public function login($email, $password)
    {
        // Validate input
        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Email and password are required'];
        }

        // Find user by email
        $stmt = $this->conn->prepare("SELECT id, username, email, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            // Verify password
            if (password_verify($password, $user['password'])) {
                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];

                return ['success' => true, 'message' => 'Login successful'];
            } else {
                return ['success' => false, 'message' => 'Invalid password'];
            }
        } else {
            return ['success' => false, 'message' => 'User not found'];
        }
    }

    /**
     * Get user profile
     * @param int $user_id
     * @return array
     */
    public function getProfile($user_id)
    {
        $stmt = $this->conn->prepare("SELECT id, username, email, phone, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            return ['success' => true, 'user' => $result->fetch_assoc()];
        } else {
            return ['success' => false, 'message' => 'User not found'];
        }
    }

    /**
     * Update user profile
     * @param int $user_id
     * @param string $username
     * @param string $phone
     * @return array
     */
    public function updateProfile($user_id, $username, $phone)
    {
        // Validate input
        if (empty($username) || empty($phone)) {
            return ['success' => false, 'message' => 'Username and phone are required'];
        }

        // Check if username is already taken by another user
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $stmt->bind_param("si", $username, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return ['success' => false, 'message' => 'Username is already taken'];
        }

        // Update user profile
        $stmt = $this->conn->prepare("UPDATE users SET username = ?, phone = ? WHERE id = ?");
        $stmt->bind_param("ssi", $username, $phone, $user_id);

        if ($stmt->execute()) {
            // Update session
            $_SESSION['username'] = $username;

            return ['success' => true, 'message' => 'Profile updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to update profile'];
        }
    }

    /**
     * Change user password
     * @param int $user_id
     * @param string $old_password
     * @param string $new_password
     * @return array
     */
    public function changePassword($user_id, $old_password, $new_password)
    {
        // Validate input
        if (empty($old_password) || empty($new_password)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }

        // Get current password
        $stmt = $this->conn->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Verify old password
        if (!password_verify($old_password, $user['password'])) {
            return ['success' => false, 'message' => 'Current password is incorrect'];
        }

        // Hash new password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // Update password
        $stmt = $this->conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->bind_param("si", $hashed_password, $user_id);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Password changed successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to change password'];
        }
    }

    /**
     * Logout user
     * @return array
     */
    public function logout()
    {
        // Unset all session variables
        $_SESSION = array();

        // Destroy the session
        session_destroy();

        return ['success' => true, 'message' => 'Logged out successfully'];
    }

    /**
     * Check if user is logged in
     * @return bool
     */
    public function isLoggedIn()
    {
        return isset($_SESSION['user_id']);
    }

    /**
     * Get current user ID
     * @return int|null
     */
    public function getCurrentUserId()
    {
        return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    }
}

// Create UserManager instance
$userManager = new UserManager($conn);

// Handle API requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the action from the request
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    // Set header to return JSON
    header('Content-Type: application/json');

    switch ($action) {
        case 'register':
            $username = isset($_POST['username']) ? $_POST['username'] : '';
            $email = isset($_POST['email']) ? $_POST['email'] : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';
            $phone = isset($_POST['phone']) ? $_POST['phone'] : '';

            echo json_encode($userManager->register($username, $email, $password, $phone));
            break;

        case 'login':
            $email = isset($_POST['email']) ? $_POST['email'] : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';

            echo json_encode($userManager->login($email, $password));
            break;

        case 'logout':
            echo json_encode($userManager->logout());
            break;

        case 'update_profile':
            if (!$userManager->isLoggedIn()) {
                echo json_encode(['success' => false, 'message' => 'Not authenticated']);
                break;
            }

            $user_id = $userManager->getCurrentUserId();
            $username = isset($_POST['username']) ? $_POST['username'] : '';
            $phone = isset($_POST['phone']) ? $_POST['phone'] : '';

            echo json_encode($userManager->updateProfile($user_id, $username, $phone));
            break;

        case 'change_password':
            if (!$userManager->isLoggedIn()) {
                echo json_encode(['success' => false, 'message' => 'Not authenticated']);
                break;
            }

            $user_id = $userManager->getCurrentUserId();
            $old_password = isset($_POST['old_password']) ? $_POST['old_password'] : '';
            $new_password = isset($_POST['new_password']) ? $_POST['new_password'] : '';

            echo json_encode($userManager->changePassword($user_id, $old_password, $new_password));
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }

    // Close the connection
    $conn->close();
}
