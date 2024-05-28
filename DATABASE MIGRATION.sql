CREATE TABLE pienote
USE pienote

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Savings (
    saving_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0.00,
    due_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Wishlists (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    item_name VARCHAR(100) NOT NULL,
    estimated_cost DECIMAL(10, 2),
    priority ENUM('low', 'medium', 'high'),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE SplitBills (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE SplitBillDetails (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT,
    participant_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES SplitBills(bill_id),
    FOREIGN KEY (participant_id) REFERENCES Users(user_id)
);

