-- Create the database
CREATE SCHEMA pienote;

-- Use the created database
USE pienote;

-- Create the tables
CREATE TABLE users (
    user_id INT(11) NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100),
    username VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    password VARCHAR(100),
    access_token VARCHAR(255),
    created_at DATETIME,
    PRIMARY KEY (user_id)
);

CREATE TABLE bills (
    bill_id INT(11) NOT NULL AUTO_INCREMENT,
    bill_name VARCHAR(100),
    user_id INT(11),
    created_at TIMESTAMP,
    PRIMARY KEY (bill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE items (
    item_id INT(11) NOT NULL AUTO_INCREMENT,
    bill_id INT(11),
    item_name VARCHAR(100),
    amount INT(11),
    price DECIMAL(10,2),
    sub_total DECIMAL(10,2),
    image_path VARCHAR(256),
    user_id INT(11),
    created_at TIMESTAMP,
    PRIMARY KEY (item_id),
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE bill_friends (
    billfriend_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    bill_id INT(11),
    PRIMARY KEY (billfriend_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id)
);

CREATE TABLE income_notes (
    income_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    amount DECIMAL(10,2),
    income_category VARCHAR(100),
    description TEXT,
    date DATETIME,
    PRIMARY KEY (income_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE expense_notes (
    expense_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    amount DECIMAL(10,2),
    expense_category VARCHAR(100),
    description TEXT,
    date DATETIME,
    PRIMARY KEY (expense_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE personal_savings (
    personalsaving_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    saving_name VARCHAR(100),
    description TEXT,
    target DECIMAL(20,2),
    place_saving VARCHAR(100),
    date DATETIME,
    notification ENUM('Hari', 'Minggu', 'Bulan'),
    wishlist TINYINT(1),
    PRIMARY KEY (personalsaving_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE personal_current_saving (
    personalcurrentsaving_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    add_current_saving DECIMAL(20,2),
    date DATETIME,
    PRIMARY KEY (personalcurrentsaving_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE group_savings (
    groupsavings_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    saving_name VARCHAR(100),
    description TEXT,
    target DECIMAL(20,2),
    place VARCHAR(100),
    date DATETIME,
    notification VARCHAR(25),
    wishlist TINYINT(1),
    PRIMARY KEY (groupsavings_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE group_current_saving (
    groupcurrentsaving_id INT(11) NOT NULL AUTO_INCREMENT,
    groupsavings_id INT(11),
    add_current_saving DECIMAL(20,2),
    date DATETIME,
    PRIMARY KEY (groupcurrentsaving_id),
    FOREIGN KEY (groupsavings_id) REFERENCES group_savings(groupsavings_id)
);

CREATE TABLE saving_friends (
    savingfriend_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    groupsavings_id INT(11),
    PRIMARY KEY (savingfriend_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (groupsavings_id) REFERENCES group_savings(groupsavings_id)
);

-- Insert sample data into the pienote_users table
INSERT INTO users (full_name, username, email, phone_number, password, access_token, created_at) VALUES
('Admin', 'admin', 'admin@example.com', '1234567890', 'admin123', 'token12345', NOW()),