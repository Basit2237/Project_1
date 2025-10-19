CREATE TABLE IF NOT EXISTS user (
  id INT PRIMARY KEY, -- UUID
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(100) NOT NULL,
  role ENUM('admin', 'student', 'teacher') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);