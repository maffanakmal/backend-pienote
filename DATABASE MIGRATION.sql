CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    username VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    password VARCHAR(100),
    access_token VARCHAR(255),
    created_at DATETIME
);

CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_name VARCHAR(100),
    user_id INT,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT,
    item_name VARCHAR(100),
    amount INT,
    price DECIMAL(10, 2),
    sub_total DECIMAL(10, 2),
    image_path VARCHAR(255),
    user_id INT,
    created_at TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE bill_friends (
    billfriend_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bill_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id)
);

CREATE TABLE expense_notes (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2),
    expense_category VARCHAR(100),
    description TEXT,
    date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE income_notes (
    income_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2),
    income_category VARCHAR(100),
    description TEXT,
    date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE personal_savings (
    personalsaving_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    saving_name VARCHAR(100),
    description TEXT,
    target DECIMAL(10, 2),
    place_saving VARCHAR(100),
    dateline DATE,
    notification ENUM('Hari', 'Minggu', 'Bulan'),
    wishlist TINYINT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE group_savings (
    groupsavings_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    saving_name VARCHAR(100),
    description TEXT,
    target DECIMAL(10, 2),
    place VARCHAR(100),
    dateline DATE,
    notification VARCHAR(25),
    wishlist VARCHAR(25),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE saving_friends (
    savingfriend_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    groupsavings_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (groupsavings_id) REFERENCES group_savings(groupsavings_id)
);

CREATE TABLE personal_current_savings (
    personalcurrentsaving_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    add_current_saving DECIMAL(10,2) NOT NULL,
    date DATETIME NOT NULL,
    groupsavings_id INT(11),
    FOREIGN KEY (groupsavings_id) REFERENCES group_savings(groupsavings_id)
);

