-- Create the orders database
CREATE DATABASE IF NOT EXISTS orders_db;
USE orders_db;

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    delivery_agent_id INT,
    order_status ENUM('pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    order_date DATETIME NOT NULL,
    delivery_date DATETIME,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create delivery_agents table
CREATE TABLE IF NOT EXISTS delivery_agents (
    agent_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status ENUM('available', 'busy', 'offline') NOT NULL DEFAULT 'offline',
    current_location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for delivery agents in orders table
ALTER TABLE orders
ADD FOREIGN KEY (delivery_agent_id) REFERENCES delivery_agents(agent_id);

-- Create order_tracking table
CREATE TABLE IF NOT EXISTS order_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status_update ENUM('order_placed', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL,
    location VARCHAR(200),
    update_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
); 